// Include Modules
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
// Include User model
const User = require('../models/user')


module.exports = {
  getLogin: (req, res) => {
    res.render('login', { userCSS: true })
  },
  getRegister: (req, res) => {
    res.render('register', { userCSS: true })
  },
  postRegister: (req, res) => {
    const { name, email, password, rePassword } = req.body
    // error message for flash
    const errors = []

    // not accepting empty input
    if (!email || !password || !rePassword) { errors.push({ message: '電子信箱和密碼是必填喔' }) }
    // password and confirm password must be the same
    if (password !== rePassword) { errors.push({ message: '密碼錯誤' }) }
    // show signup page again with inputted data when invalid 
    if (errors.length > 0) {
      return res.render('register', { name, email, password, rePassword, errors, userCSS: true })
    }

    User.findOne({ email: email })
      .then(user => {
        // if account already exist, redirect to log in page
        if (user) { return res.render('login', { email, userCSS: true, errors: [{ message: 'Email 已經註冊過，請直接登入' }] }) }
        // otherwise, create new document
        const newUser = new User({ name: name || '食客', email, password })
        // encrypt password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err
            // replace password with hashed one
            newUser.password = hash
            //save document to user collection
            newUser.save()
              .then(user => {
                return res.redirect('/')
              })
              .catch(err => console.log(err))
          })
        })
      })
  },
  getLogout: (req, res) => {
    // clear up session
    req.logout()
    // add flash message
    req.flash('success_msg', '你已經成功登出')
    // redirect back to login page
    res.redirect('/users/login')
  }
}