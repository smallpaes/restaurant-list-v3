// Include Express
const express = require('express')
// Get router from express
const router = express.Router()
// Include Mongoose
const mongoose = require('mongoose')
// Include Restaurant Model
const Restaurant = require('../models/restaurant')

// searching restaurant
router.get('/', (req, res) => {
  // Escaping special character
  function replacer(match) { return `\\${match}` }
  const updatedInput = req.query.keyword.replace(/\W/g, replacer)
  // Define regular expression 
  const regex = new RegExp(updatedInput, 'i')
  Restaurant.find({ $or: [{ name: regex }, { category: regex }] }, (err, restaurants) => {
    if (err) return console.error(err)
    let emptyData = restaurants.length === 0 ? true : false
    return res.render('index', { restaurants, searchInput: req.query.keyword, emptyData })
  })
})

// searching restaurant by keyword
router.get('/category/:category', (req, res) => {
  Restaurant.find({ category: req.params.category }, (err, restaurants) => {
    if (err) return console.error(err)
    let emptyData = restaurants.length === 0 ? true : false
    return res.render('index', { restaurants, searchInput: req.params.category, emptyData })
  })
})

router.get('/rating/:rating', (req, res) => {
  Restaurant.find({ rating: { $gte: req.params.rating } }, (err, restaurants) => {
    if (err) return console.error(err)
    let emptyData = restaurants.length === 0 ? true : false
    return res.render('index', { restaurants, emptyData })
  })
})

module.exports = router