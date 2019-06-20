const express = require('express')
const app = express()
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')

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
  const { name, name_em, location, google_map, phone, category, rating, image } = req.body
  // create new document
  const restaurant = new Restaurant({ name, name_em, location, google_map, phone, category, rating, image })
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
    return res.render('edit', {
      // Specify a helper for this rendering: add selected to selected category
      restaurant, helpers: { [restaurant.category]() { return 'selected' } }
    })
  })
})

// Submit edit
app.post('/restaurants/:id', (req, res) => {
  Restaurant.findById(req.params.id, (err, restaurant) => {
    console.log(restaurant)
    if (err) return console.error(err)
    // update data
    restaurant.name = req.body.name
    restaurant.name_en = req.body.name_en
    restaurant.category = req.body.category
    restaurant.image = req.body.image
    restaurant.location = req.body.location
    restaurant.phone = req.body.phone
    restaurant.google_map = req.body.google_map
    restaurant.rating = req.body.rating
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

// detail page
app.get('/restaurants/:id', (req, res) => {
  Restaurant.findById(req.params.id, (err, restaurants) => {
    if (err) return console.error(err)
    return res.render('detail', { restaurants })
  })
})


app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})