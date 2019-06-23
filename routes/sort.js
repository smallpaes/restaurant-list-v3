const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant')
const { convertSortName, createCriteria } = require('../data-process')

router.get('/', (req, res) => {
  const sortBy = convertSortName(req.query.sort)
  const rating = [4, 3, 2, 1]
  Restaurant.find({})
    .sort({ [sortBy]: 'asc' })
    .exec((err, restaurants) => {
      if (err) return console.error(err)
      res.render('index', { restaurants, indexCSS: true, rating: rating, ratingOptions: [] })
    })
})

router.get('/:ratingOptions', (req, res) => {
  const sortBy = convertSortName(req.query.sort)
  const rating = [4, 3, 2, 1]
  const ratingOptions = req.params.ratingOptions.split(',')
  const criteria = createCriteria(ratingOptions)

  Restaurant.find(criteria)
    .sort({ [sortBy]: 'asc' })
    .exec((err, restaurants) => {
      if (err) return console.error(err)
      res.render('index', { restaurants, indexCSS: true, rating: rating, ratingOptions })
    })
})

module.exports = router