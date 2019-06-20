function validateNumber(number) {
  const regex = /^\d{2}\s{1}\d{4}\s{1}\d{4}$/
  return number.match(regex) ? true : false
}


module.exports = validateNumber