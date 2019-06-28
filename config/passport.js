const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const User = require('../models/user')
const bcrypt = require('bcryptjs')

module.exports = passport => {

  // Local Strategy
  passport.use(new LocalStrategy(
    // find credential in parameter named email instead of username(default)
    // set passReqToCallback true to pass req as well
    { usernameField: 'email', passReqToCallback: true },
    (req, email, password, done) => {
      User.findOne({ email: email })
        .then(user => {
          if (!user) { return done(null, false, req.flash('fail_msg', 'Email 輸入錯誤')) }
          // check if user input matches the password in database
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err
            return isMatch ? done(null, user) : done(null, false, req.flash('fail_msg', '密碼錯誤'))
          })
        })
        .catch(err => done(err))
    }
  ))

  // Facebook strategy
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['displayName', 'email'],
    passReqToCallback: true
  },
    (req, accessToken, refreshToken, profile, done) => {
      User.findOne({ email: profile._json.email })
        .then(user => {
          // existing user
          if (user) { return done(null, user) }

          // new user
          const randomPassword = Math.random().toString(36).slice(-8)
          // encrypt password
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(randomPassword, salt, (err, hash) => {
              if (err) throw err
              const newUser = new User({
                name: profile._json.name,
                email: profile._json.email,
                password: hash
              })
              // Save document to user collection
              newUser.save()
                .then(user => done(null, user))
                .catch(err => console.error(err))
            })
          })
        })
        .catch(err => done(err, false, req.flash('fail_msg', 'Facebook 驗證失敗')))
    }
  ))

  // Google Strategy
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK,
    passReqToCallback: true
  },
    (req, accessToken, refreshToken, profile, done) => {
      User.findOne({ email: profile._json.email })
        .then(user => {
          // existing user
          if (user) { return done(null, user) }
          //new user
          const randomPassword = Math.random().toString(36).slice(-8)
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(randomPassword, salt, (err, hash) => {
              if (err) throw err
              // create new user
              const newUser = new User({
                name: profile._json.name,
                email: profile._json.email,
                password: hash
              })
              // save new user document to user collection
              newUser.save()
                .then(user => done(null, user))
                .catch(err => console.error(err))
            })
          })
        })
        .catch(err => done(err, false, req.flash('fail_msg', 'Google 驗證失敗')))
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