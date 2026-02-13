import express from 'express'
import orderController from '../controllers/orderController.js'
import protect from '../middleware/authMiddleware.js'
import adminOnly from '../middleware/adminMiddleware.js'

const router = express.Router()

// Customer routes (must be logged in)
router.post('/', protect, orderController.placeOrder)
router.get('/my-orders', protect, orderController.getMyOrders)
router.get('/:id', protect, orderController.getOrderById)

// Admin routes
router.get('/', protect, adminOnly, orderController.getAllOrders)
router.put('/:id/status', protect, adminOnly, orderController.updateStatus)
router.get('/analytics/summary', protect, adminOnly, orderController.getDashboardSummary)
router.get('/analytics/revenue', protect, adminOnly, orderController.getRevenue)
router.get('/analytics/top-items', protect, adminOnly, orderController.getTopItems)

export default router
