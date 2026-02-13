import orderService from '../services/orderService.js'

const orderController = {
  placeOrder: async (req, res, next) => {
    try {
      const order = await orderService.placeOrder(req.user.userId, req.body)
      res.status(201).json({ status: 'success', message: 'Order placed successfully', data: { order } })
    } catch (err) { next(err) }
  },

  getMyOrders: async (req, res, next) => {
    try {
      const { page = 1, limit = 10 } = req.query
      const data = await orderService.getMyOrders(req.user.userId, { page: parseInt(page), limit: parseInt(limit) })
      res.json({ status: 'success', data })
    } catch (err) { next(err) }
  },

  getOrderById: async (req, res, next) => {
    try {
      const order = await orderService.getOrderById(
        parseInt(req.params.id),
        req.user.userId,
        req.user.role === 'admin'
      )
      res.json({ status: 'success', data: { order } })
    } catch (err) { next(err) }
  },

  // Admin
  getAllOrders: async (req, res, next) => {
    try {
      const { page = 1, limit = 20, status } = req.query
      const data = await orderService.getAllOrders({ page: parseInt(page), limit: parseInt(limit), status })
      res.json({ status: 'success', data })
    } catch (err) { next(err) }
  },

  updateStatus: async (req, res, next) => {
    try {
      const order = await orderService.updateOrderStatus(parseInt(req.params.id), req.body.status)
      res.json({ status: 'success', message: 'Order status updated', data: { order } })
    } catch (err) { next(err) }
  },

  getDashboardSummary: async (req, res, next) => {
    try {
      const summary = await orderService.getDashboardSummary()
      res.json({ status: 'success', data: { summary } })
    } catch (err) { next(err) }
  },

  getRevenue: async (req, res, next) => {
    try {
      const { startDate, endDate } = req.query
      const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      const end = endDate || new Date().toISOString().split('T')[0]
      const data = await orderService.getRevenue(start, end)
      res.json({ status: 'success', data: { revenue: data } })
    } catch (err) { next(err) }
  },

  getTopItems: async (req, res, next) => {
    try {
      const items = await orderService.getTopItems()
      res.json({ status: 'success', data: { items } })
    } catch (err) { next(err) }
  },
}

export default orderController
