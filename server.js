var express = require('express')
var bodyParser = require('body-parser')
var path = require('path')
var morgan = require('morgan')
var mongoose = require('mongoose')

var configDB = require('./server/config/mongo')
mongoose.connect(configDB.db)

var port = 8080

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

app.use(express.static(__dirname + '/dist'))
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/dist/index.html'))
})

require('./server/routes')(app)

app.listen(port)
