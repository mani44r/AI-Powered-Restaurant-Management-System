import express from 'express'
import authController from '../controllers/authController.js'
import protect from '../middleware/authMiddleware.js'
import adminOnly from '../middleware/adminMiddleware.js'

const router = express.Router()

// Public routes
router.post('/register', authController.register)
router.post('/login', authController.login)

// Protected routes (must be logged in)
router.get('/profile', protect, authController.getProfile)
router.put('/profile', protect, authController.updateProfile)
router.put('/change-password', protect, authController.changePassword)

// Admin routes
router.get('/users', protect, adminOnly, authController.getAllUsers)

export default router
