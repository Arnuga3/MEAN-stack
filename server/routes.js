var express = require('express')
var passport = require('passport')
var jwt = require('jsonwebtoken')

var User = require('./models/user')

// Session false
const authRequired = passport.authenticate('jwt', { session: process.env.AUTH_SESSION })

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
    console.log('body.username - ' + req.body.username)
    console.log('query.username - ' + req.query.username)
    // Find a user by the username
    User.findOne({
      username: req.body.username
    }).select('_id email username password exp wins games coins shopStyle').exec(function (err, user) {
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
          }, process.env.AUTH_SECRET, {
            // Expires in 24 hours
            expiresIn: '24h'
          })

          // Return the information including token as JSON
          res.json({
            success: true,
            message: 'Here is your token.',

            // User object fetched from DB, here can customise
            user: JSON.stringify({
              id: user._id,
              username: user.username,
              email: user.email,
              exp: user.exp,
              wins: user.wins,
              games: user.games,
              coins: user.coins,
              shopStyle: user.shopStyle
            }),
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

  apiRouter.get('/user/:id', function (req, res) {
    User.findById(req.params.id, (err, user) => {
      if (err) return res.status(500).send(err)
      res.json(user)
    })
  })

  apiRouter.get('/user/:id/shop/:type', function (req, res) {
    // Styles available
    const styles = [
      {
        type: 'standard',
        price: 0
      },
      {
        type: 'metal',
        price: 10
      },
      {
        type: 'pirate',
        price: 20
      }
    ]
    User.findById(req.params.id, (err, user) => {
      if (err) return res.status(500).send(err)
      for (let style of styles) {
        if (style.type === req.params.type) {
          if (user.coins >= style.price) {
            let moneyLeft = user.coins - style.price
            User.findByIdAndUpdate(
              user.id, { $set: { coins: moneyLeft, shopStyle: style.type } }, (err) => {
                if (err) return console.log(err)
                console.log(user)
              }
            )
            User.findById(user.id, (err, user) => {
              if (err) return res.status(500).send(err)
              res.json(user)
            })
          }
        }
      }
    })
  })

  // Routes /api/users
  apiRouter.route('/users')
  // POST /api/users - save a new user
  .post(function (req, res) {
    // Create a new User instance
    var user = new User()
    user.email = req.body.email
    user.username = req.body.username
    user.password = req.body.password
    user.exp = req.body.exp
    user.wins = req.body.wins
    user.games = req.body.games
    user.coins = req.body.coins
    user.shopStyle = req.body.shopStyle
    // Save to db
    user.save(function (err) {
      if (err) {
        // duplicate entry
        if (err.code === 11000) return res.json({success: false, message: 'A user with that username already exists.'})
        else return res.send(err)
      }
      res.json({message: 'User created!', user: user})
    })
  })
  // GET /api/users - get all users from DB
  .get(function (req, res) {
    User.find({}).sort({exp: 'desc'}).exec((err, users) => {
      if (err) console.log(err)
      res.json(users)
    })
  })

  app.use('/api', apiRouter)
}
