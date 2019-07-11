// Include Mongoose
const mongoose = require('mongoose')
// Include Restaurant Model
const Restaurant = require('../models/restaurant')
// Include customize modules
const { getRatingCount, getCriteria } = require('./data-process')
// other variables
const ITEMS_PER_PAGE = 6

module.exports = getSearchRestaurant = async (req, res) => {
  let rating = {}
  const page = parseInt(req.query.page) || 1

  // get criteria for data search
  const { textInput, categoryCriteria, regex, filterCriteria, sortBy, ratingOptions } = getCriteria(req.query)
  const ratingOptionsQuery = ratingOptions.map(item => `rating=${item}`).join('&') || 'rating='

  try {
    // find all restaurants
    const totalRestaurants = await Restaurant.find({
      $and: [
        { $or: [{ name: regex }, { category: regex }] },
        { userId: req.user._id }
      ]
    })
    rating = getRatingCount(totalRestaurants)

    // find total amount of restaurant for pagination
    const totalRestaurantsNum = await Restaurant.find({
      $and: [
        { $or: [{ name: regex }, { category: regex }] },
        { userId: req.user._id },
        categoryCriteria,
        filterCriteria
      ]
    }).countDocuments()
    const totalPage = Math.ceil(totalRestaurantsNum / ITEMS_PER_PAGE)
    const hasLastPage = totalPage > 1 && page !== 1 ? true : false
    const hasNextPage = totalPage > 1 && page !== totalPage ? true : false


    // find restaurants
    const restaurants = await await Restaurant.find({
      $and: [
        { $or: [{ name: regex }, { category: regex }] },
        { userId: req.user._id },
        categoryCriteria,
        filterCriteria
      ]
    })
      .sort({ [sortBy]: 'desc' })
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)

    const emptyData = restaurants.length === 0
    res.render('index', { restaurants, textInput, emptyData, indexCSS: true, rating, ratingOptions, ratingOptionsQuery, currentPage: page, totalPage, hasLastPage, hasNextPage, nextPage: page + 1, lastPage: page - 1, sort: req.query.sort || '' })
  } catch (err) {
    console.error(err)
  }
}