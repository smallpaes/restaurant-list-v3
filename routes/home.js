const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant')
const { getRatingCount } = require('../data-process')

router.get('/', (req, res) => {
  Restaurant.find((err, restaurants) => {
    if (err) return console.error(err)
    // Count document amount of each rating range on filter panel
    const rating = getRatingCount(restaurants)
    return res.render('index', { restaurants, indexCSS: true, rating, ratingOptions: [] })
  })
})

module.exports = router