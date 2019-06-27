const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = require('../models/user')
const passport = require('passport')


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
  const { name, email, password, rePassword } = req.body
  User.findOne({ email: email })
    .then(user => {
      // if account already exist, redirect to log in page
      if (user) { return res.render('login', { email, userCSS: true }) }
      // otherwise, save user info
      const newUser = new User({ name, email, password })
      newUser.save()
        .then(user => {
          return res.redirect('/')
        })
        .catch(err => console.log(err))
    })
})

router.get('/logout', (req, res) => {
  res.send('logout')
})

module.exports = router