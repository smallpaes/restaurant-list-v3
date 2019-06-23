const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant')

router.get('/', (req, res) => {
  Restaurant.find((err, restaurants) => {
    if (err) return console.error(err)
    const rating = [4, 3, 2, 1]
    return res.render('index', { restaurants, indexCSS: true, rating: rating, ratingOptions: [] })
  })
})

module.exports = router