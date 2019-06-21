const Handlebars = require('handlebars')

Handlebars.registerHelper('isSelected', function (selected, current, options) {
  return selected === current ? 'selected' : ''
})

Handlebars.registerHelper('validate', function (validation, options) {
  if (validation === undefined) { return }
  return validation ? 'is-valid' : 'is-invalid'
})