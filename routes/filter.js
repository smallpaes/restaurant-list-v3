const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant')
const { getRatingCount, createCriteria } = require('../data-process')

router.get('/', (req, res) => {
  const ratingOptions = (req.query.rating) ? [...req.query.rating] : []
  const criteria = createCriteria(ratingOptions)
  let rating = {}

  /*Promise chaining: https://thecodebarbarian.com/how-find-works-in-mongoose*/
  Restaurant.find({})
    //find all restaurants to count document amount of each rating range on filter panel
    .then(restaurants => {
      rating = getRatingCount(restaurants)
      return Restaurant.find(criteria)
    })
    // then find restaurants with filter criteria to display
    .then(restaurants => {
      const emptyData = restaurants.length === 0 ? true : false
      res.render('index', { indexCSS: true, rating, emptyData, restaurants, ratingOptions })
    })
    // send error message if any
    .catch(err => console.error(err))
})

module.exports = router