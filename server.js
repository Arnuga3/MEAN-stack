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

mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ds223019.mlab.com:23019/warship`)
// 3.6 driver mongodb+srv://<USER>:<PASSWORD>@cluster0-pii2f.mongodb.net/test

var port = process.env.PORT || 5000
var sockets = new Set()

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
// Websocket
var io = require('socket.io')(server)

// Game
var battles = []
var players = {}
var Battle = require('./server/game/Battle')
var Player = require('./server/game/Player')

io.on('connection', socket => {
  console.log('new socket connection')

  socket.on('setPlayer', data => {
    let username = data.username
    // Set socket id to username(username should be unique)
    socket.id = username
    if (players.hasOwnProperty(username)) {
      delete players[username]
      socket.emit('onSetPlayer', { message: `ws - ${username} reconnected` })
    } else {
      socket.emit('onSetPlayer', { message: `ws - ${username} connected` })
    }
    players[username] = socket
    io.emit('notification', {
      message: `ws - ${username} joined the game`
    })
  })

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

  socket.on('disconnect', () => {
    console.log(`Deleting socket: ${socket.id}`)
    sockets.delete(socket)
    console.log(`Remaining sockets: ${sockets.size}`)
  })
})

server.listen(port)
