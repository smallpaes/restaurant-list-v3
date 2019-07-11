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

Handlebars.registerHelper('createPageNumber', function (page, currentPage, keyword, sort, rating, options) {
  const currentPageIndex = currentPage - 1
  let pagination = ``
  for (let i = 0; i < page; i++) {
    pagination += currentPageIndex === i ? `<li class="page-item active"><a class="page-link" href="/search?keyword=${keyword}&sort=${sort}&${rating}&page=${i + 1}">${i + 1}</a></li>` : `<li class="page-item"><a class="page-link" href="/search?keyword=${keyword}&sort=${sort}&${rating}&page=${i + 1}">${i + 1}</a></li>`
  }
  return pagination
})