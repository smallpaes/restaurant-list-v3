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

// searching restaurant
router.get('/', (req, res) => {
  let rating = {}

  // get criteria for data search
  const { textInput, categoryCriteria, regex, filterCriteria, sortBy, ratingOptions } = getCriteria(req.query)

  Restaurant.find({ $or: [{ name: regex }, { category: regex }] })
    .then(restaurants => {
      rating = getRatingCount(restaurants)
      return Restaurant.find({
        $and: [
          { $or: [{ name: regex }, { category: regex }] },
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