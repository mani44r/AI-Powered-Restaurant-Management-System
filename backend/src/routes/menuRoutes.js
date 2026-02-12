import express from 'express'
import menuController from '../controllers/menuController.js'
import protect from '../middleware/authMiddleware.js'
import adminOnly from '../middleware/adminMiddleware.js'

const router = express.Router()

// Public routes
router.get('/', menuController.getAll)
router.get('/featured', menuController.getFeatured)
router.get('/categories', menuController.getCategories)
router.get('/:id', menuController.getById)

// Admin routes
router.post('/', protect, adminOnly, menuController.create)
router.put('/:id', protect, adminOnly, menuController.update)
router.delete('/:id', protect, adminOnly, menuController.delete)
router.patch('/:id/toggle', protect, adminOnly, menuController.toggleAvailability)

export default router
