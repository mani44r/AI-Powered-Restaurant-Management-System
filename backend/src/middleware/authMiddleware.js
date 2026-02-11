/*
  WHY THIS FILE EXISTS:
  This middleware protects routes that require authentication.

  RESPONSIBILITY:
  - Extracts JWT from the Authorization header
  - Verifies the token is valid and not expired
  - Attaches the decoded user data to req.user for downstream use
  - Rejects requests with no/invalid token (401)

  WHAT IS MIDDLEWARE?
  Middleware is a function that runs BETWEEN receiving a request and 
  sending a response. It can:
  1. Execute any code
  2. Modify the request/response objects
  3. Call next() to continue, or send a response to stop the chain

  REQUEST FLOW WITH THIS MIDDLEWARE:
  Client → Route → authMiddleware → Controller → Response
                       ↓ (if token invalid)
                   Send 401 Unauthorized

  HOW IT COMMUNICATES:
  - Applied to protected routes in routes/*.js
  - Sets req.user so controllers know WHO is making the request
  - Works with generateToken.js (same JWT_SECRET must be used)

  INTERVIEW QUESTION:
  Q: What does Bearer mean in "Authorization: Bearer <token>"?
  A: It's a token type from the OAuth 2.0 standard meaning "the bearer 
     of this token has the right to access the resource." It's just a 
     naming convention — Express doesn't enforce it automatically.
*/

import jwt from 'jsonwebtoken'
import ApiError from '../utils/apiError.js'

// Protect routes — verifies the user is logged in
export const protect = async (req, res, next) => {
  try {
    let token

    // Check if Authorization header exists and starts with "Bearer"
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1] // Extract just the token part
    }

    if (!token) {
      return next(new ApiError(401, 'Access denied. No token provided.'))
    }

    // Verify the token using our secret key
    // This throws an error if token is invalid or expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Attach decoded user info to the request object
    // Controllers can now access req.user.userId, req.user.role, etc.
    req.user = decoded

    next() // Token is valid — proceed to the controller
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Token expired. Please login again.'))
    }
    if (error.name === 'JsonWebTokenError') {
      return next(new ApiError(401, 'Invalid token.'))
    }
    next(error)
  }
}

export default protect
