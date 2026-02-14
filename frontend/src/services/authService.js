/*
  WHY THIS FILE EXISTS:
  Handles all API calls related to authentication.
  
  RESPONSIBILITY:
  - register() — POST /api/auth/register
  - login()    — POST /api/auth/login
  - logout()   — Clears local storage
  - getProfile() — GET /api/auth/profile

  WHY SEPARATE FROM api.js?
  api.js is the HTTP tool (like a phone).
  authService.js is what you say on the phone regarding authentication.
  Separation keeps each file focused on one job.
*/

import api from './api'

const authService = {
  // Register a new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  // Login and save token + user to localStorage
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    const { token, user } = response.data
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    return response.data
  },

  // Logout — clear everything from localStorage
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  // Get the currently logged-in user from localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  // Fetch user profile from server
  getProfile: async () => {
    const response = await api.get('/auth/profile')
    return response.data
  },
}

export default authService
