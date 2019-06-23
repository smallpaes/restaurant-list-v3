// Import Express again
const express = require('express')
// Mini Express app that can be plugged into other Express app
const router = express.Router()
// Include Mongoose
const mongoose = require('mongoose')
// Include Restaurant model
const Restaurant = require('../models/restaurant')
// Include validateForm function
const { validateForm } = require('../data-process')

// page to create new restaurant
router.get('/new', (req, res) => {
  res.render('new', { formCSS: true })
})

// create one new restaurant
router.post('/new', (req, res) => {

  // validate each input of the form submitted
  const validateResult = validateForm(req.body)

  // get overall validation result of the form submitted
  const formIsInvalidate = Object.values(validateResult).includes(false)

  // ask user to update invalid input
  if (formIsInvalidate) {
    return res.render('new', { restaurant: req.body, validateResult, formCSS: true })
  }

  const { name, name_en, location, google_map, phone, category, rating, image, description } = req.body

  // create new document
  const restaurant = new Restaurant({ name, name_en, location, google_map, phone, category, rating, image, description })

  // save new document
  restaurant.save(err => {
    if (err) return console.error(err)
    return res.redirect('/')
  })
})

// edit page
router.get('/:id/edit', (req, res) => {
  Restaurant.findById(req.params.id, (err, restaurant) => {
    if (err) return console.error(err)
    return res.render('edit', { restaurant, formCSS: true })
  })
})

// Submit edit
router.put('/:id', (req, res) => {

  // validate each input of the form submitted
  const validateResult = validateForm(req.body)
  // get overall validation result of the form submitted
  const formIsInvalidate = Object.values(validateResult).includes(false)

  // ask user to update invalid input
  if (formIsInvalidate) {
    req.body.id = req.params.id
    return res.render('edit', { restaurant: req.body, validateResult, formCSS: true })
  }

  Restaurant.findById(req.params.id, (err, restaurant) => {
    if (err) return console.error(err)
    // update data
    for (let property in req.body) {
      restaurant[property] = req.body[property]
    }

    // save data back to database
    restaurant.save(err => {
      if (err) return console.error(err)
      // redirect back to detail page
      return res.redirect(`/restaurants/${req.params.id}`)
    })
  })
})

// delete restaurant
router.delete('/:id/delete', (req, res) => {
  Restaurant.findById(req.params.id, (err, restaurant) => {
    if (err) return console.error(err)
    // remove the restaurant from database
    restaurant.remove(err => {
      if (err) return console.error(err)
      // redirect back to landing page 
      return res.redirect('/')
    })
  })
})

// detail page
router.get('/:id', (req, res) => {
  Restaurant.findById(req.params.id, (err, restaurant) => {
    if (err) return console.error(err)
    return res.render('detail', { restaurant, detailCSS: true })
  })
})

module.exports = router