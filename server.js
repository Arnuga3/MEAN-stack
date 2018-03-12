var express = require('express')
var http = require('http')
var bodyParser = require('body-parser')
var path = require('path')
var morgan = require('morgan')
var mongoose = require('mongoose')
var history = require('connect-history-api-fallback')

var configDB = require('./server/config/mongo')
mongoose.connect(configDB.db)

var port = 8080
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

io.on('connection', socket => {
  console.log('user connected')
  console.log(`Socket ${socket.id} added`)

  socket.on('clientMessage', data => {
    console.log(data)
    socket.broadcast.emit('newMessage', {
      message: 'not anymore/' + data.message
    })
  })

  socket.on('disconnect', () => {
    console.log(`Deleting socket: ${socket.id}`)
    sockets.delete(socket)
    console.log(`Remaining sockets: ${sockets.size}`)
  })
})

server.listen(port)
