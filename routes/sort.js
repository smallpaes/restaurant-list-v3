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
      const rating = getRatingCount(restaurants)
      res.render('index', { restaurants, indexCSS: true, rating, ratingOptions: [] })
    })
})

// sort with selected filter options
router.get('/:ratingOptions', (req, res) => {
  // convert input value name(Chinese) into property name in db
  const sortBy = convertSortName(req.query.sort)
  const ratingOptions = req.params.ratingOptions.split(',')
  const criteria = createCriteria(ratingOptions)

  Restaurant.find(criteria)
    .sort({ [sortBy]: 'desc' })
    .exec((err, restaurants) => {
      if (err) return console.error(err)
      // Count document amount of each rating range on filter panel
      const rating = getRatingCount(restaurants)
      res.render('index', { restaurants, indexCSS: true, rating, ratingOptions })
    })
})

module.exports = router