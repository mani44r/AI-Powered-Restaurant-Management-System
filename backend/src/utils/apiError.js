/*
  WHY THIS FILE EXISTS:
  A custom error class for creating consistent, structured API errors.

  RESPONSIBILITY:
  - Extends the built-in Error class
  - Adds an HTTP status code to every error
  - Used by controllers and services to throw meaningful errors

  WHY NOT JUST USE: throw new Error('Not found') ?
  The built-in Error has no status code. When you throw a generic Error,
  your error handler doesn't know if it's a 400, 404, or 500 error.
  With ApiError, you always know what HTTP status to send back.

  INTERVIEW QUESTION:
  Q: What is the benefit of a custom error class in an Express API?
  A: It allows you to centralize error handling. Instead of every controller 
     manually setting res.status(404).json({...}), you throw an ApiError 
     and one global error handler sends the consistent response.
     This is the "fail fast" pattern combined with DRY principle.
*/

class ApiError extends Error {
  constructor(statusCode, message) {
    super(message)           // Call parent Error constructor with the message
    this.statusCode = statusCode
    this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error'
    this.isOperational = true // Marks this as a known/expected error

    // Captures the call stack correctly (Node.js best practice)
    Error.captureStackTrace(this, this.constructor)
  }
}

export default ApiError
