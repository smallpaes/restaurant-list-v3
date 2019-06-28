// Import Express again
const express = require('express')
// Mini Express app that can be plugged into other Express app
const router = express.Router()
// Include authenticated function from auth
const { authenticated } = require('../config/auth')
// Include restaurants controller
const { getNewRestaurant, postAddRestaurant, getEditRestaurant, postEditRestaurant, deleteRestaurant, getViewRestaurant } = require('../controllers/restaurants')

// page to create new restaurant
router.get('/new', authenticated, getNewRestaurant)

// create one new restaurant
router.post('/new', authenticated, postAddRestaurant)

// edit page
router.get('/:id/edit', authenticated, getEditRestaurant)

// Submit edit
router.put('/:id', authenticated, postEditRestaurant)

// delete restaurant
router.delete('/:id/delete', authenticated, deleteRestaurant)

// detail page
router.get('/:id', authenticated, getViewRestaurant)

module.exports = router