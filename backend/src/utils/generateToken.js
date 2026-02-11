/*
  WHY THIS FILE EXISTS:
  Centralizes JWT token generation in one place.

  RESPONSIBILITY:
  - Takes a user object and creates a signed JWT token
  - Token expires in 7 days (configurable via .env)

  WHAT IS A JWT?
  A JSON Web Token is a string with 3 parts separated by dots:
  HEADER.PAYLOAD.SIGNATURE
  
  Header: algorithm used (HS256)
  Payload: the data (userId, role) — NOT encrypted, just encoded
  Signature: proves the token wasn't tampered with

  Example token:
  eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjF9.abc123signature

  INTERVIEW QUESTION:
  Q: Is the JWT payload secure? Can users see it?
  A: Yes, users CAN decode the payload (it's just base64 encoded, not encrypted).
     This is fine — we only put non-sensitive data (userId, role) there.
     The SIGNATURE is what provides security. If someone tampers with the 
     payload, the signature verification will fail on the server.

  Q: Where should you store a JWT in the frontend?
  A: localStorage is common but vulnerable to XSS attacks.
     httpOnly cookies are more secure but require extra CORS setup.
     For this project we use localStorage with clear tradeoff awareness.
*/

import jwt from 'jsonwebtoken'

const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,           // Secret key from .env (never hardcode!)
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',  // Token expires in 7 days
    }
  )
}

export default generateToken
