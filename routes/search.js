// Include Express
const express = require('express')
// Get router from express
const router = express.Router()
// Include Mongoose
const mongoose = require('mongoose')
// Include Restaurant Model
const Restaurant = require('../models/restaurant')
// Include customize modules
const { getRatingCount, getCriteria } = require('../data-process')
// Include authenticated function from auth
const { authenticated } = require('../config/auth')

// searching restaurant
router.get('/', authenticated, (req, res) => {
  let rating = {}

  // get criteria for data search
  const { textInput, categoryCriteria, regex, filterCriteria, sortBy, ratingOptions } = getCriteria(req.query)

  Restaurant.find({
    $and: [
      { $or: [{ name: regex }, { category: regex }] },
      { userId: req.user._id }
    ]
  })
    .then(restaurants => {
      rating = getRatingCount(restaurants)
      return Restaurant.find({
        $and: [
          { $or: [{ name: regex }, { category: regex }] },
          { userId: req.user._id },
          categoryCriteria,
          filterCriteria
        ]
      }).sort({ [sortBy]: 'desc' })
    })
    .then(restaurants => {
      const emptyData = restaurants.length === 0 ? true : false
      res.render('index', { restaurants, textInput, emptyData, indexCSS: true, rating, ratingOptions })
    })



})

module.exports = router