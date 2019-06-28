const express = require('express')
const router = express.Router()
const { authenticated } = require('../config/auth')
// Include home controller
const homeController = require('../controllers/home')

router.get('/', authenticated, homeController)

module.exports = router