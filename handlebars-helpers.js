const Handlebars = require('handlebars')

Handlebars.registerHelper('isSelected', function (selected, current, options) {
  return selected === current ? 'selected' : ''
})