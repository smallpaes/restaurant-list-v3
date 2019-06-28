// Include Restaurant model
const Restaurant = require('../models/restaurant')
// Get data-process controller
const { getRatingCount } = require('./data-process')

module.exports = getHome = (req, res) => {
  Restaurant.find({ userId: req.user._id }, (err, restaurants) => {
    if (err) return console.error(err)
    const emptyData = restaurants.length === 0
    // Count document amount of each rating range on filter panel
    const rating = getRatingCount(restaurants)
    return res.render('index', { restaurants, emptyData, indexCSS: true, rating, ratingOptions: [] })
  })
}

