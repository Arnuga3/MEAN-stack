var express = require('express')
var passport = require('passport')
var jwt = require('jsonwebtoken')

var configAuth = require('./config/auth')
var User = require('.//models/user')

const authRequired = passport.authenticate('jwt', { session: configAuth.session })

module.exports = app => {
  // Initialize passport
  app.use(passport.initialize())
  // Defined passport strategy
  require('./auth')(passport)

  /// //////////////
  /// API Router ///
  /// //////////////
  var apiRouter = express.Router()

  // Middleware to check the authentication
  apiRouter.use(function (req, res, next) {
    console.log('Somebody made a request.')
    next()
  })

  // Authentication
  apiRouter.post('/authenticate', function (req, res) {
    console.log('authentication...')
    // Find a user by the username
    User.findOne({
      username: req.body.username
    }).select('_id username password').exec(function (err, user) {
      if (err) throw err
      // A user with that username not found
      if (!user) {
        res.json({
          success: false,
          message: 'Authentication failed. User not found.'
        })
      } else if (user) {
        // Check if password matches
        var validPassword = user.comparePassword(req.body.password)
        // Password doesn't match
        if (!validPassword) {
          res.json({
            success: false,
            message: 'Authentication failed. Wrong password.'
          })
        } else {
          // Create a token
          var token = jwt.sign({
            id: user._id
          }, configAuth.secret, {
            // Expires in 24 hours
            expiresIn: '24h'
          })
          // Return the information including token as JSON
          res.json({
            success: true,
            message: 'Here is your token.',
            userId: user._id,
            token: 'JWT ' + token
          })
        }
      }
    })
  })

  // GET /api - welcome message
  apiRouter.get('/', authRequired, function (req, res) {
    res.json({ message: 'Hello' })
  })

  apiRouter.get('/user/:id', authRequired, function (req, res) {
    User.findById(req.params.id, (err, user) => {
      if (err) return res.status(500).send(err)
      res.json(user)
    })
  })

  // Routes /api/users
  apiRouter.route('/users')
  // POST /api/users - save a new user
  .post(function (req, res) {
    // Create a new User instance
    var user = new User()
    user.email = req.query.email
    user.username = req.query.username
    user.password = req.query.password
    // Save to db
    user.save(function (err) {
      if (err) {
        // duplicate entry
        if (err.code === 11000) return res.json({success: false, message: 'A user withthat username already exists.'})
        else return res.send(err)
      }
      res.json({message: 'User created!'})
    })
  })
  // GET /api/users - get all users from DB
  .get(authRequired, function (req, res) {
    User.find(function (err, users) {
      if (err) return res.send(err)
      // Add users to a response
      res.json(users)
    })
  })

  app.use('/api', apiRouter)
}
