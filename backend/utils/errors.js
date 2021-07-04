class Error {
  constructor(message = "Error occurred") {
    this.message = message;
    this.code = 400
  }
}
class BadRequestError extends Error {
  constructor(message = "Bad Request"){
    super(message)
    this.code = 400
  }
}
class NotFoundError extends Error {
  constructor(message = "Not Found") {
    super(message)
    this.code = 404
  }
}
module.exports = {
  Error,
  BadRequestError,
  NotFoundError,
}
