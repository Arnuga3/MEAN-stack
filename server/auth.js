var passportJWT = require('passport-jwt')
var config = require('./config/auth')
var User = require('./models/user')

module.exports = function (passport) {
  var extractJWT = passportJWT.ExtractJwt
  var StrategyJWT = passportJWT.Strategy
  const options = {
    jwtFromRequest: extractJWT.fromAuthHeaderWithScheme('jwt'),
    secretOrKey: config.secret
  }
  var strategy = new StrategyJWT(options, function (JWTpayload, next) {
    console.log('payload received', JWTpayload)
    User.findById(JWTpayload.id, function (err, user) {
      if (err) throw err
      if (user) {
        next(null, user)
      } else {
        next(null, false)
      }
    })
  })
  passport.use(strategy)
}
