import authService from '../services/authService.js'
import userModel from '../models/userModel.js'

const authController = {
  register: async (req, res, next) => {
    try {
      const { name, email, password, phone } = req.body
      if (!name || !email || !password) {
        return res.status(400).json({ status: 'fail', message: 'Name, email and password are required' })
      }
      if (password.length < 6) {
        return res.status(400).json({ status: 'fail', message: 'Password must be at least 6 characters' })
      }
      const data = await authService.register({ name, email, password, phone })
      res.status(201).json({ status: 'success', message: 'Account created successfully', data })
    } catch (err) { next(err) }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body
      if (!email || !password) {
        return res.status(400).json({ status: 'fail', message: 'Email and password are required' })
      }
      const data = await authService.login({ email, password })
      res.json({ status: 'success', message: 'Login successful', data })
    } catch (err) { next(err) }
  },

  getProfile: async (req, res, next) => {
    try {
      const user = await authService.getProfile(req.user.userId)
      res.json({ status: 'success', data: { user } })
    } catch (err) { next(err) }
  },

  updateProfile: async (req, res, next) => {
    try {
      const { name, phone } = req.body
      const user = await userModel.update(req.user.userId, { name, phone })
      res.json({ status: 'success', data: { user } })
    } catch (err) { next(err) }
  },

  changePassword: async (req, res, next) => {
    try {
      await authService.changePassword(req.user.userId, req.body)
      res.json({ status: 'success', message: 'Password updated successfully' })
    } catch (err) { next(err) }
  },

  // Admin: get all users
  getAllUsers: async (req, res, next) => {
    try {
      const { page = 1, limit = 20 } = req.query
      const data = await userModel.findAll({ page: parseInt(page), limit: parseInt(limit) })
      res.json({ status: 'success', data })
    } catch (err) { next(err) }
  },
}

export default authController
