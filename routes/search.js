// Include Express
const express = require('express')
// Get router from express
const router = express.Router()
// Include authenticated function from auth
const { authenticated } = require('../config/auth')
// Include search controller
const searchController = require('../controllers/search')

// searching restaurant
router.get('/', authenticated, searchController)

module.exports = router