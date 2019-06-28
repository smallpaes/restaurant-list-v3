const mongoose = require('mongoose')
const Restaurant = require('../restaurant')
const User = require('../user')
const bcrypt = require('bcryptjs')

const { users: userList } = require('../../user.json')
const { results: restaurantList } = require('../../restaurant.json')

mongoose.connect('mongodb://127.0.0.1/restaurant', { useNewUrlParser: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('db error!')
})

db.once('open', () => {
  console.log('db connected!')

  userList.forEach((user, index) => {
    // create users
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) throw err
        User
          .create({
            email: user.email,
            password: hash
          })
          .then(users => {
            // #1 - #3 for user1; #4 - #6 for user2
            const restaurants = index ? restaurantList.slice(3, 6) : restaurantList.slice(0, 3)
            restaurants.forEach(restaurant => {
              Restaurant.create({
                name: restaurant.name,
                name_en: restaurant.name_en,
                category: restaurant.category,
                image: restaurant.image,
                location: restaurant.location,
                phone: restaurant.phone,
                google_map: restaurant.google_map,
                rating: restaurant.rating,
                description: restaurant.description,
                userId: users._id
              })
            })
          })
      })
    })
  })
})


