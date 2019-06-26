// Include Express
const express = require('express')
// Get router from express
const router = express.Router()
// Include Mongoose
const mongoose = require('mongoose')
// Include Restaurant Model
const Restaurant = require('../models/restaurant')
// Include customize modules
const { getRatingCount, createCriteria, convertSortName } = require('../data-process')

// searching restaurant
router.get('/', (req, res) => {
  console.log(req.query)

  // handle category fast search
  const textInput = req.query.category ? req.query.category : req.query.keyword
  const categoryCriteria = req.query.category ? { category: req.query.category } : {}

  // Escaping special character
  function replacer(match) { return `\\${match}` }
  const updatedInput = textInput.replace(/\W/g, replacer)
  // Define regular expression 
  const regex = new RegExp(updatedInput, 'i')

  // handle filter
  const ratingOptions = req.query.selectAll ? ['1', '2', '3', '4']
    : req.query.rating ? [...req.query.rating]
      : []
  const criteria = createCriteria(ratingOptions)

  // handle sort 
  const sortBy = req.query.sort ? convertSortName(req.query.sort) : 'rating'

  let rating = {}

  Restaurant.find({ $or: [{ name: regex }, { category: regex }] })
    .then(restaurants => {
      rating = getRatingCount(restaurants)
      return Restaurant.find({
        $and: [
          { $or: [{ name: regex }, { category: regex }] },
          categoryCriteria,
          criteria
        ]
      }).sort({ [sortBy]: 'desc' })
    })
    .then(restaurants => {
      const emptyData = restaurants.length === 0 ? true : false
      res.render('index', { restaurants, textInput, emptyData, indexCSS: true, rating, ratingOptions })
    })
})


module.exports = router