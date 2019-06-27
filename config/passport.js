const LocalStrategy = require('passport-local')
const mongoose = require('mongoose')
const User = require('../models/user')

module.exports = passport => {
  passport.use(new LocalStrategy(
    // find credential in parameter named email instead of username(default)
    { usernameField: 'email' },
    (email, password, done) => {
      User.findOne({ email: email })
        .then(user => {
          if (!user) { return done(null, false, { message: 'Incorrect username' }) }
          if (user.password !== password) {
            return done(null, false, { message: 'Incorrect password' })
          }
          return done(null, user)
        })
        .catch(err => done(err))
    }
  ))

  // serialize user instance to the session
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  // deserialize user instance from the session
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user)
    })
  })
}