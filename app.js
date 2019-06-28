const express = require('express')
const app = express()
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const handlebarHelpers = require('./handlebars-helpers')
const methodOverride = require('method-override')
const homeRoutes = require('./routes/home')
const restaurantsRoutes = require('./routes/restaurants')
const searchRoutes = require('./routes/search')
const userRoutes = require('./routes/user')
const session = require('express-session')
const passport = require('passport')
const authRoutes = require('./routes/auths')
const flash = require('connect-flash')
const errorController = require('./controllers/error')
// check if it's not in production mode, then ask dotenv to load env file
if (process.env.NODE_ENV !== 'production') { require('dotenv').config() }

const port = 3000

// Register ExpressHandlebars instance-level helpers
const hbs = exphbs.create({ helpers: {} })
// define handlebars using
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
// tell express that all templates ahead will be handlebars 
app.set('view engine', 'handlebars')

// set up mongoose connection to MongoDB
mongoose.connect('mongodb://127.0.0.1/restaurant', { useNewUrlParser: true, useCreateIndex: true })

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

// use express-session
app.use(session({
  secret: 'nksnfoiehhrekwqnrlkje',
  resave: 'false',
  saveUninitialized: 'false'
}))

// express takes all request body and parse it into JS object
app.use(bodyParser.urlencoded({ extended: true }))

// use method-override
app.use(methodOverride('_method'))

// use built-in middleware static() to serve static files
app.use(express.static('public'))

// Initialize passport
app.use(passport.initialize())
// used for persistent login sessions
app.use(passport.session())

// include strategy configuration
require('./config/passport')(passport)

// Use flash middleware: all requests will have a req.flash()
app.use(flash())

// keep req.user in res.local that can be used in view
app.use((req, res, next) => {
  res.locals.user = req.user
  // check if already authenticated
  res.locals.isAuthenticated = req.isAuthenticated()
  // add flash keys
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  res.locals.fail_msg = req.flash('fail_msg')
  // keep the name for view to show
  res.locals.userName = req.user ? req.user.name : '食客'
  next()
})

// landing page
app.use('/', homeRoutes)

// Outsourced routes & filter only routes starting with /users
app.use('/users', userRoutes)

// Outsourced routes & filter only routes starting with /auth
app.use('/auth', authRoutes)

// Outsourced routes & filter only routes starting with /restaurants
app.use('/restaurants', restaurantsRoutes)

// Outsourced routes & filter only routes starting with /search
app.use('/search', searchRoutes)

// 404 error page
app.use(errorController)

app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})