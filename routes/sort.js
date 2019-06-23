const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant')

router.get('/', (req, res) => {
  const sortBy = req.query.sort === '餐廳名字' ? "name"
    : '餐廳評價' ? 'rating' : 'category'

  Restaurant.find({})
    .sort({ [sortBy]: 'asc' })
    .exec((err, restaurants) => {
      if (err) return console.error(err)
      const rating = [4, 3, 2, 1]
      res.render('index', { restaurants, indexCSS: true, rating: rating, ratingOptions: [] })
    })
})

module.exports = router