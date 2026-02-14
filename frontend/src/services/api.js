/*
  WHY THIS FILE EXISTS:
  This is the CENTRAL AXIOS CONFIGURATION file.

  RESPONSIBILITY:
  - Creates a single axios instance with the backend base URL
  - Automatically attaches the JWT token to every request
  - Handles token expiry (401 responses) in one place

  WHY NOT JUST USE fetch() EVERYWHERE?
  If you hardcode the API URL in 20 components, changing the URL means 
  editing 20 files. With this file, you change it once here.
  This is the DRY principle — Don't Repeat Yourself.

  HOW IT COMMUNICATES:
  - authService.js, menuService.js, orderService.js all import this
  - They use this instance instead of raw axios/fetch

  INTERVIEW QUESTION:
  Q: What is an Axios interceptor?
  A: A function that runs before every request (request interceptor) or 
     after every response (response interceptor). Used to attach tokens,
     log requests, or handle errors globally without repeating code.
*/

import axios from 'axios'

// Base URL from environment variable — never hardcode this!
// In development: http://localhost:5000/api
// In production: your Render backend URL
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create a custom axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

/*
  REQUEST INTERCEPTOR
  Runs automatically before EVERY request made with this axios instance.
  It grabs the JWT token from localStorage and attaches it to the 
  Authorization header.
  
  Without this, you'd have to manually add the token in every API call.
*/
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

/*
  RESPONSE INTERCEPTOR
  Runs automatically after EVERY response.
  If the server returns 401 (Unauthorized = token expired or invalid),
  we clear the stored token and redirect to login.
  
  This prevents users from being stuck in a broken state with an expired token.
*/
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
