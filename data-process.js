function getCountNumber(list, rating) {
  return list.filter(restaurant => restaurant.rating >= rating && restaurant.rating < rating + 1).length
}

module.exports = {
  validateForm: function ({ name, name_en, location, google_map, phone, category, rating, image, description }) {
    return {
      name: name.length > 0 ? true : false,
      name_en: name_en.length >= 0 ? true : false,
      location: location.length > 0 ? true : false,
      google_map: google_map === '' ? true
        : google_map.match(/https:\/\/|http:\/\//) ? true : false,
      phone: phone.match(/^\d{2}\s{1}\d{4}\s{1}\d{4}$/) ? true : false,
      category: category ? true : false,
      rating: rating === '' ? false
        : (rating >= 0 && rating <= 5) ? true : false,
      image: image.length === 0 ? true
        : image.match(/https:\/\/|http:\/\//) ? true : false,
      description: description.length >= 0 ? true : false
    }
  },
  createCriteria: function (options) {
    // no option us selected
    if (options.length === 0) return {}
    // only one option is selected
    if (options.length === 1) return { rating: { $gte: Number(options[0]), $lt: Number(options[0]) + 1 } }

    // multiple options are selected
    const objects = options.map(option => {
      return {
        rating: { '$gte': Number(option), '$lt': Number(option) + 1 }
      }
    })

    return {
      $or: objects
    }
  },
  convertSortName: function (name) {
    return name === '餐廳名字' ? "name"
      : name === '餐廳評價' ? 'rating' : 'category'
  },
  getRatingCount: function (restaurantList) {
    const result = {}
    for (let i = 1; i < 5; i++) {
      result[i] = getCountNumber(restaurantList, i)
    }
    return result
  }
}
