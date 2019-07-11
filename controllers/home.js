// Include Restaurant model
const Restaurant = require('../models/restaurant')
// Get data-process controller
const { getRatingCount } = require('./data-process')
// other variables
const ITEMS_PER_PAGE = 6

module.exports = getHome = async (req, res) => {
  const page = parseInt(req.query.page) || 1
  try {
    // find total restaurants
    const totalRestaurants = await Restaurant.find({ userId: req.user._id })
    // Count document amount of each rating range on filter panel
    const rating = getRatingCount(totalRestaurants)

    // find total restaurants
    const totalRestaurantsNum = await Restaurant.find({ userId: req.user._id }).countDocuments()
    const totalPage = Math.ceil(totalRestaurantsNum / ITEMS_PER_PAGE)
    const hasLastPage = totalPage > 1 && page !== 1 ? true : false
    const hasNextPage = totalPage > 1 && page !== totalPage ? true : false

    // find restaurants
    const restaurants = await Restaurant.find({ userId: req.user._id })
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)

    const emptyData = restaurants.length === 0
    res.render('index', { restaurants, emptyData, indexCSS: true, rating, ratingOptions: [], ratingOptionsQuery: 'rating=', currentPage: page, totalPage, hasLastPage, hasNextPage, nextPage: page + 1, lastPage: page - 1, textInput: '', sort: '' })
  } catch (err) {
    console.error(err)
  }
}
