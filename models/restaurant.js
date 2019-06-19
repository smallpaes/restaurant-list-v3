const mongoose = require('mongoose')
const Schema = mongoose.Schema

const restaurantSchema = new Schema({
  name: {
    type: String,
    requires: true
  },
  name_en: {
    type: String
  },
  category: {
    type: String,
    requires: true
  },
  image: {
    type: String
  },
  location: {
    type: String,
    requires: true
  },
  phone: {
    type: String,
    requires: true
  },
  google_map: {
    type: String
  },
  rating: {
    type: Number,
    requires: true
  },
  description: {
    type: String
  },
})

module.exports = mongoose.model('Restaurant', restaurantSchema)