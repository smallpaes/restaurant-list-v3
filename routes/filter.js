const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant')

router.get('/', (req, res) => {
  const rating = [4, 3, 2, 1]
  function createCriteria(options) {
    let objects = req.query.rating.map(option => {
      return {
        rating: { '$gte': Number(option), '$lt': Number(option) + 1 }
      }
    })

    return {
      $or: objects
    }
  }

  const ratingOptions = [...req.query.rating]
  const criteria = ratingOptions.length === 1 ? { rating: { $gte: Number(req.query.rating), $lt: Number(req.query.rating) + 1 } }
    : createCriteria(ratingOptions)

  Restaurant.find(criteria, (err, restaurants) => {
    res.render('index', { indexCSS: true, rating: rating, restaurants, ratingOptions })
  })
})

module.exports = router