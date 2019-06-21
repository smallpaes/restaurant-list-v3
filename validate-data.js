function validateForm({ name, name_en, location, google_map, phone, category, rating, image, description }) {
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
}


module.exports = validateForm