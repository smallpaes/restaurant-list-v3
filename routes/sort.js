const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant')
const { getRatingCount, convertSortName, createCriteria } = require('../data-process')

// sort with no selected filter option
router.get('/', (req, res) => {
  // convert input value name(Chinese) into property name in db
  const sortBy = convertSortName(req.query.sort)
  Restaurant.find({})
    .sort({ [sortBy]: 'desc' })
    .exec((err, restaurants) => {
      if (err) return console.error(err)
      const emptyData = restaurants.length === 0 ? true : false
      const rating = getRatingCount(restaurants)
      res.render('index', { restaurants, emptyData, indexCSS: true, rating, ratingOptions: [] })
    })
})

// sort with selected filter options
router.get('/:ratingOptions', (req, res) => {
  // convert input value name(Chinese) into property name in db
  const sortBy = convertSortName(req.query.sort)
  const ratingOptions = req.params.ratingOptions.split(',')
  const criteria = createCriteria(ratingOptions)
  let rating = {}

  Restaurant.find({})
    //find all restaurants to count document amount of each rating range on filter panel
    .then(restaurants => {
      rating = getRatingCount(restaurants)
      return Restaurant.find(criteria).sort({ [sortBy]: 'desc' }).exec()
    })
    // then find restaurants with filter criteria to display
    .then(restaurants => {
      const emptyData = restaurants.length === 0 ? true : false
      res.render('index', { restaurants, emptyData, indexCSS: true, rating, ratingOptions })
    })
    // send error message if any
    .catch(err => console.error(err))
})

module.exports = router