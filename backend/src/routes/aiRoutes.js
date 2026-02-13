import express from 'express'
import aiController from '../controllers/aiController.js'
import protect from '../middleware/authMiddleware.js'

const router = express.Router()

// AI chatbot (public)
router.post('/chat', aiController.chat)

// AI recommendations (requires login for personalization)
router.post('/recommendations', protect, aiController.getRecommendations)

export default router
