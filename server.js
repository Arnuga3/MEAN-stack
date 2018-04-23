var express = require('express')
var http = require('http')
var bodyParser = require('body-parser')
var path = require('path')
var morgan = require('morgan')
var mongoose = require('mongoose')
var history = require('connect-history-api-fallback')
// var util = require('util')
require('dotenv').config()
// mongoose.connect(`mongodb://localhost:27017`)

// mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ds223019.mlab.com:23019/warship`)
mongoose.connect('mongodb://localhost/users')
var port = process.env.PORT || 5000

var app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization')
  next()
})

app.use(morgan('dev'))

// Required for angular routing - redirecting to the index.html
app.use(history({
  verbose: true
}))

app.use(express.static(path.join(__dirname, '/dist')))
app.get('/', function (req, res) {
  res.sendFile(path.join(path.join(__dirname, '/dist/index.html')))
})

require('./server/routes')(app)

var server = http.createServer(app)
  .listen(port, () => console.log(`Listening on ${port}`))

// Websocket
var io = require('socket.io')(server)

// Game global variables
var sockets = []
var battles = []
var players = {}
var gameAwaitUsers = []
var Battle = require('./server/game/Battle')
var Player = require('./server/game/Player')

io.on('connection', socket => {
  console.log('new socket connection')
  sockets.push(socket)

/* /// GAME REQUEST /// */
  socket.on('gameRequest', (data) => {
    // console.log('check userX data: ' + JSON.stringify(data.userX))

    let isAlready = false
    // Check if player is already in a waiting list
    for (let x in gameAwaitUsers) {
      if (gameAwaitUsers[x].username === data.userX.username) {
        isAlready = true
        console.log('is already')
      }
    }
    // Check if player is in a battle
    for (let x in battles) {
      if (battles[x].player[0].username === data.userX.username || battles[x].player[1].username === data.userX.username) {
        isAlready = true
        console.log('is already in a battle')
      }
    }
    // Add a user to a waiting array
    if (!isAlready) gameAwaitUsers.push(data.userX)

    // Put 2 players in a battle
    if (gameAwaitUsers.length >= 2) {
      let player1 = gameAwaitUsers[0]
      let player2 = gameAwaitUsers[1]

      // Create a new battle
      let battle = new Battle(new Player(player1), new Player(player2))
      // Create a random battle name (date as number)
      let date = new Date()
      const battleRoom = date.getTime()
      battle.name = battleRoom

      // Notify users by passing a battle name to both players
      for (let x in sockets) {
        let socket = sockets[x]
        if (socket.idx === player1.username || socket.idx === player2.username) {
          // xconsole.log('notified ' + socket.idx)
          // Add to a battle
          socket.join(battleRoom)
          // Send a battle name to user
          socket.emit('battleStarted', { message: { user: socket.idx, battle, attacker: player1.username } })
        }
      }

      // Delete them from waiting array
      gameAwaitUsers.shift()
      gameAwaitUsers.shift()

      // Add to battles array
      battles.push(battle)
    }
    // console.log('await ' + JSON.stringify(gameAwaitUsers))
    // console.log('battles ' + JSON.stringify(battles))
  })
/* /// GAME REQUEST END /// */

/* /// GAME LOGIC /// */
  socket.on('attack', data => {
    // console.log('request received for attack: ' + JSON.stringify(data))
    // Find an appropriate battle
    for (let battle of battles) {
      if (battle.name === +data.battleName) {
        // Loop battle users
        for (let player of battle.players) {
          // Loop sockets
          for (let socket of sockets) {
            if (socket.idx === player.username) {
              socket.emit('gameState', {
                message: JSON.stringify(battle.getState(player.username))
              })
            }
          }
        }
      }
    }
    io.to(data.battleName).emit('newMessage', { message: `Battle(${data.battleName}) ${socket.idx} made an attack! Cell: ${data.shot}` })
  })
/* /// GAME LOGIC END /// */

/* /// USERS ONLINE /// */
  socket.on('getUsersOnline', () => {
    io.emit('usersOnline', { message: Object.keys(players).length })
  })
/* /// USERS ONLINE END /// */

/* /// JOINING GAME PORT /// */
  socket.on('setPlayer', data => {
    let username = data.username
    // Set socket idx to username(username should be unique)
    socket.idx = username
    if (players.hasOwnProperty(username)) {
      delete players[username]
      socket.emit('onSetPlayer', { message: `${username} reconnected` })
    } else {
      socket.emit('onSetPlayer', { message: `Welcome to the game, ${username}! It is nice to have you back!` })
    }
    players[username] = socket
    io.emit('notification', {
      message: `${username} has entered the port.`
    })
  })
/* /// JOINING GAME PORT END/// */

/* /// SENDING MESSAGE /// */
  socket.on('privateMessage', data => {
    console.log(JSON.stringify(data))
    let playersOnline = Object.keys(players).length
    console.log(playersOnline)
    // console.log(util.inspect(players))
    let to = data.message.to
    let from = data.message.from
    if (to in players) {
      players[to].emit('newMessage', {
        message: `Hi from ${from}`
      })
    } else console.log(`ws - player ${to} is not connected`)
  })
/* /// SENDING MESSAGE END /// */

/* /// LEAVING GAME PORT /// */
  socket.on('disconnect', () => {
    for (var player in players) {
      if (players.hasOwnProperty(player)) {
        if (socket.idx === player) {
          delete players[player]
          // console.log('player disconnected and removed from the players array')
          io.emit('usersOnline', { message: Object.keys(players).length })
          io.emit('notification', {
            message: `${player} has left the port.`
          })
        }
      }
    }
    console.log(`Deleting socket: ${socket.id}`)
    for (let i in sockets) {
      if (sockets[i].id === socket.id) sockets.splice(i, 1)
    }
    console.log(`Remaining sockets: ${sockets.length}`)
  })
/* /// LEAVING GAME PORT END /// */
})
