const express = require('express')
const app = express()
const mongoose = require('mongoose')

const port = 3000

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

app.get('/', (req, res) => {
  res.send('Landing Page')
})

app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})