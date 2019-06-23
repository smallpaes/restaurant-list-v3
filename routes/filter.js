const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant')
const { createCriteria } = require('../data-process')

router.get('/', (req, res) => {
  const rating = [4, 3, 2, 1]
  const ratingOptions = (req.query.rating) ? [...req.query.rating] : []
  const criteria = createCriteria(ratingOptions)

  Restaurant.find(criteria, (err, restaurants) => {
    if (err) return console.error(err)
    res.render('index', { indexCSS: true, rating: rating, restaurants, ratingOptions })
  })
})

module.exports = router