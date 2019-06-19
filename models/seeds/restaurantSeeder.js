const mongoose = require('mongoose')
const Restaurant = require('../restaurant')

const { results: restaurantList } = require('../../restaurant.json')

mongoose.connect('mongodb://127.0.0.1/restaurant', { useNewUrlParser: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('db error!')
})

db.once('open', () => {
  console.log('db connected!')

  restaurantList.forEach(restaurant => {
    Restaurant.create({
      name: restaurant.name,
      name_en: restaurant.name_en,
      category: restaurant.category,
      image: restaurant.image,
      location: restaurant.location,
      phone: restaurant.phone,
      google_map: restaurant.google_map,
      rating: restaurant.rating,
      description: restaurant.description
    })
  })

  console.log('restaurant seeds are created')

})


