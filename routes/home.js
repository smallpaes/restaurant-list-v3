const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant')
const { getRatingCount } = require('../data-process')
const { authenticated } = require('../config/auth')

router.get('/', authenticated, (req, res) => {
  Restaurant.find({ userId: req.user._id }, (err, restaurants) => {
    if (err) return console.error(err)
    const emptyData = restaurants.length === 0
    // Count document amount of each rating range on filter panel
    const rating = getRatingCount(restaurants)
    return res.render('index', { restaurants, emptyData, indexCSS: true, rating, ratingOptions: [] })
  })
})

module.exports = router