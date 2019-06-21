const express = require('express')
const app = express()
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const handlebarHelpers = require('./handlebars-helpers')
const restaurantsRoutes = require('./routes/restaurants')

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

// Outsourced routes & filter only routes starting with /restaurants
app.use('/restaurants', restaurantsRoutes)

// searching restaurant
app.get('/search', (req, res) => {
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
app.get('/search/:category', (req, res) => {
  Restaurant.find({ category: req.params.category }, (err, restaurants) => {
    if (err) return console.error(err)
    return res.render('index', { restaurants, searchInput: req.params.category })
  })
})

// 404 error page
app.use((req, res) => {
  res.status(404).render('404')
})

app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})