const express = require('express')
const router = express.Router()
const passport = require('passport')

// Facebook authentication route
router.get('/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }))

// Facebook authentication callback route
router.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

// Google authentication route
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

// Google authentication callback route
router.get('/google/callback', passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

module.exports = router