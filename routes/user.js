const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = require('../models/user')
const passport = require('passport')
const bcrypt = require('bcryptjs')


router.get('/login', (req, res) => {
  res.render('login', { userCSS: true })
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

router.get('/register', (req, res) => {
  res.render('register', { userCSS: true })
})

router.post('/register', (req, res) => {
  const { name, email, password } = req.body

  User.findOne({ email: email })
    .then(user => {
      // if account already exist, redirect to log in page
      if (user) { return res.render('login', { email, userCSS: true }) }
      // otherwise, create new document
      const newUser = new User({ name, email, password })
      // encrypt password
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err
          // replace password with hashed one
          newUser.password = hash
          //save document to user collection
          newUser.save()
            .then(user => {
              return res.redirect('/')
            })
            .catch(err => console.log(err))
        })
      })
    })
})

router.get('/logout', (req, res) => {
  // clear up session
  req.logout()
  // redirect back to login page
  res.redirect('/users/login')
})

module.exports = router