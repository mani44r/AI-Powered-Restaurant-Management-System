/*
  WHY THIS FILE EXISTS:
  This is the GLOBAL ERROR HANDLER for the entire Express application.

  RESPONSIBILITY:
  - Catches ALL errors thrown anywhere in the app (controllers, services, models)
  - Sends a consistent JSON error response every time
  - Prevents leaking sensitive stack traces to the client in production

  HOW EXPRESS ERROR HANDLING WORKS:
  In Express, a middleware with 4 parameters (err, req, res, next) is 
  automatically treated as an error-handling middleware.
  When any route/middleware calls next(error) or throws inside async code,
  Express skips all normal middleware and calls this handler directly.

  INTERVIEW QUESTION:
  Q: What makes Express recognize error-handling middleware?
  A: The function signature must have exactly 4 parameters: (err, req, res, next).
     Express checks the arity (number of params) to identify error handlers.

  Q: What is the difference between operational errors and programming errors?
  A: Operational errors are expected (user not found, invalid input, DB timeout).
     Programming errors are bugs (undefined is not a function).
     We should send friendly messages for operational errors and 
     generic "server error" for programming errors.
*/

const errorHandler = (err, req, res, next) => {
  // Default to 500 if no status code was set
  const statusCode = err.statusCode || 500
  const status = err.status || 'error'

  // Log error details on the server (never shown to client)
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[ERROR] ${statusCode} - ${err.message}`)
    console.error(err.stack)
  }

  res.status(statusCode).json({
    status,
    message: err.message || 'Something went wrong',
    // Only include stack trace in development mode
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}

// 404 handler — for routes that don't exist
export const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`)
  error.statusCode = 404
  next(error)
}

export default errorHandler
