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
      res.render('index', { restaurants, indexCSS: true })
    })
})

module.exports = router