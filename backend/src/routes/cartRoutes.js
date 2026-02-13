import express from 'express'
import cartController from '../controllers/cartController.js'
import protect from '../middleware/authMiddleware.js'

const router = express.Router()

// All cart routes require authentication
router.get('/', protect, cartController.getCart)
router.post('/', protect, cartController.addToCart)
router.put('/:itemId', protect, cartController.updateQuantity)
router.delete('/clear', protect, cartController.clearCart)
router.delete('/:itemId', protect, cartController.removeFromCart)

export default router
