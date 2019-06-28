const express = require('express')
const router = express.Router()
const passport = require('passport')
//Include user controller
const { getLogin, getRegister, postRegister, getLogout } = require('../controllers/user')

router.get('/login', getLogin)

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true
}))

router.get('/register', getRegister)

router.post('/register', postRegister)

router.get('/logout', getLogout)

module.exports = router