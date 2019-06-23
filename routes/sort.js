const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant')
const { getRatingCount, convertSortName, createCriteria } = require('../data-process')

router.get('/', (req, res) => {
  const sortBy = convertSortName(req.query.sort)
  Restaurant.find({})
    .sort({ [sortBy]: 'asc' })
    .exec((err, restaurants) => {
      if (err) return console.error(err)
      const rating = getRatingCount(restaurants)
      res.render('index', { restaurants, indexCSS: true, rating, ratingOptions: [] })
    })
})

router.get('/:ratingOptions', (req, res) => {
  const sortBy = convertSortName(req.query.sort)
  const ratingOptions = req.params.ratingOptions.split(',')
  const criteria = createCriteria(ratingOptions)

  Restaurant.find(criteria)
    .sort({ [sortBy]: 'asc' })
    .exec((err, restaurants) => {
      if (err) return console.error(err)
      const rating = getRatingCount(restaurants)
      res.render('index', { restaurants, indexCSS: true, rating, ratingOptions })
    })
})

module.exports = router