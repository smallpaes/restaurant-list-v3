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
  failureRedirect: '/users/login',
  failureFlash: true
}))

router.get('/register', (req, res) => {
  res.render('register', { userCSS: true })
})

router.post('/register', (req, res) => {
  const { name, email, password, rePassword } = req.body
  // error message for flash
  const errors = []

  // not accepting empty input
  if (!email || !password || !rePassword) { errors.push({ message: '電子信箱和密碼是必填喔' }) }
  // password and confirm password must be the same
  if (password !== rePassword) { errors.push({ message: '密碼錯誤' }) }
  // show signup page again with inputted data when invalid 
  if (errors.length > 0) {
    return res.render('register', { name, email, password, rePassword, errors, userCSS: true })
  }

  User.findOne({ email: email })
    .then(user => {
      // if account already exist, redirect to log in page
      errors.push({ message: 'Email 已經註冊過，請直接登入' })
      if (user) { return res.render('login', { email, userCSS: true, errors }) }
      // otherwise, create new document
      const newUser = new User({ name: name || '食客', email, password })
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
  // add flash message
  req.flash('success_msg', '你已經成功登出')
  // redirect back to login page
  res.redirect('/users/login')
})

module.exports = router