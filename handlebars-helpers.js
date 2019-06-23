const Handlebars = require('handlebars')

Handlebars.registerHelper('isSelected', function (selected, current, options) {
  return selected === current ? 'selected' : ''
})

Handlebars.registerHelper('validate', function (validation, options) {
  if (validation === undefined) { return }
  return validation ? 'is-valid' : 'is-invalid'
})

Handlebars.registerHelper('times', function (num, block) {
  let result = ''
  for (let i = 0; i < num; i++) {
    result += block.fn(this)
  }
  return result
})

Handlebars.registerHelper('contain', function (selectedOptions, thisOption, options) {
  if (selectedOptions.includes(thisOption.toString())) { return options.fn(this) }
})