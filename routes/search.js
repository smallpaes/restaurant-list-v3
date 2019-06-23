// Include Express
const express = require('express')
// Get router from express
const router = express.Router()
// Include Mongoose
const mongoose = require('mongoose')
// Include Restaurant Model
const Restaurant = require('../models/restaurant')
// Include customize modules
const { getRatingCount } = require('../data-process')

// searching restaurant
router.get('/', (req, res) => {
  // Escaping special character
  function replacer(match) { return `\\${match}` }
  const updatedInput = req.query.keyword.replace(/\W/g, replacer)
  // Define regular expression 
  const regex = new RegExp(updatedInput, 'i')

  Restaurant.find({})
    //find all restaurants to count document amount of each rating range on filter panel
    .then(restaurants => {
      rating = getRatingCount(restaurants)
      return Restaurant.find({ $or: [{ name: regex }, { category: regex }] })
    })
    // then find restaurants with filter criteria to display
    .then(restaurants => {
      let emptyData = restaurants.length === 0 ? true : false
      res.render('index', { restaurants, searchInput: req.query.keyword, emptyData, indexCSS: true, rating, ratingOptions: [] })
    })
    // send error message if any
    .catch(err => console.error(err))
})

// searching restaurant by keyword
router.get('/category/:category', (req, res) => {
  Restaurant.find({})
    //find all restaurants to count document amount of each rating range on filter panel
    .then(restaurants => {
      rating = getRatingCount(restaurants)
      return Restaurant.find({ category: req.params.category })
    })
    // then find restaurants with filter criteria to display
    .then(restaurants => {
      let emptyData = restaurants.length === 0 ? true : false
      res.render('index', { restaurants, searchInput: req.params.category, emptyData, indexCSS: true, rating, ratingOptions: [] })
    })
    // send error message if any
    .catch(err => console.error(err))
})

router.get('/rating/:rating', (req, res) => {
  Restaurant.find({})
    //find all restaurants to count document amount of each rating range on filter panel
    .then(restaurants => {
      rating = getRatingCount(restaurants)
      return Restaurant.find({ rating: { $gte: req.params.rating } })
    })
    // then find restaurants with filter criteria to display
    .then(restaurants => {
      let emptyData = restaurants.length === 0 ? true : false
      res.render('index', { restaurants, emptyData, indexCSS: true, rating, ratingOptions: [] })
    })
    // send error message if any
    .catch(err => console.error(err))
})

module.exports = router