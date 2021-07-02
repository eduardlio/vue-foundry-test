class Error {
  constructor(message = "Error occurred") {
    this.message = message;
    this.code = 500
  }
}
class BadRequestError extends Error {
  constructor(message = "Bad Request"){
    super(message)
    this.code = 400
  }
}
module.exports = {
  Error,
  BadRequestError
}