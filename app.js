const express = require('express')
const app = express()
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const handlebarHelpers = require('./handlebars-helpers')
const validateForm = require('./validate-data')

const port = 3000

// Register ExpressHandlebars instance-level helpers
const hbs = exphbs.create({ helpers: {} })
// define handlebars using
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
// tell express that all templates ahead will be handlebars 
app.set('view engine', 'handlebars')

// set up mongoose connection to MongoDB
mongoose.connect('mongodb://127.0.0.1/restaurant', { useNewUrlParser: true })

// retrieve responded "connection" object after successful execution
const db = mongoose.connection

// connection error
db.on('error', () => {
  console.log('mongodb error!')
})

// connect successfully 
db.once('open', () => {
  console.log('mongodb connected!')
})

// include restaurant model
const Restaurant = require('./models/restaurant')

// express takes all request body and parse it into JS object
app.use(bodyParser.urlencoded({ extended: true }))

// use built-in middleware static() to serve static files
app.use(express.static('public'))

// landing page
app.get('/', (req, res) => {
  Restaurant.find((err, restaurants) => {
    if (err) return console.error(err)
    return res.render('index', { restaurants })
  })
})

// page to create new restaurant
app.get('/restaurants/new', (req, res) => {
  res.render('new')
})

// create one new restaurant
app.post('/restaurants/new', (req, res) => {
  const { name, name_en, location, google_map, phone, category, rating, image, description } = req.body

  // validate each input of the form submitted
  const validateResult = validateForm(req.body)

  // get overall validation result of the form submitted
  const formIsInvalidate = Object.values(validateResult).includes(false)

  // ask user to update invalid input
  if (formIsInvalidate) {
    return res.render('new', { restaurant: req.body, validateResult })
  }

  // create new document
  const restaurant = new Restaurant({ name, name_en, location, google_map, phone, category, rating, image, description })

  // save new document
  restaurant.save(err => {
    if (err) return console.error(err)
    return res.redirect('/')
  })
})

// edit page
app.get('/restaurants/:id/edit', (req, res) => {
  Restaurant.findById(req.params.id, (err, restaurant) => {
    if (err) return console.error(err)
    return res.render('edit', { restaurant })
  })
})

// Submit edit
app.post('/restaurants/:id', (req, res) => {

  // validate each input of the form submitted
  const validateResult = validateForm(req.body)
  // get overall validation result of the form submitted
  const formIsInvalidate = Object.values(validateResult).includes(false)

  // ask user to update invalid input
  if (formIsInvalidate) {
    req.body.id = req.params.id
    return res.render('edit', { restaurant: req.body, validateResult })
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
app.post('/restaurants/:id/delete', (req, res) => {
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

// searching restaurant
app.get('/restaurants/search', (req, res) => {
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
app.get('/restaurants/search/:category', (req, res) => {
  Restaurant.find({ category: req.params.category }, (err, restaurants) => {
    if (err) return console.error(err)
    return res.render('index', { restaurants, searchInput: req.params.category })
  })
})

// detail page
app.get('/restaurants/:id', (req, res) => {
  Restaurant.findById(req.params.id, (err, restaurant) => {
    if (err) return console.error(err)
    return res.render('detail', { restaurant })
  })
})

// error page
app.use((req, res) => {
  res.status(404).render('404')
})

app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})