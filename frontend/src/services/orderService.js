import api from './api'

const orderService = {
  placeOrder: async (orderData) => {
    const response = await api.post('/orders', orderData)
    return response.data
  },
  getMyOrders: async (params = {}) => {
    const response = await api.get('/orders/my-orders', { params })
    return response.data
  },
  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`)
    return response.data
  },
  // Admin
  getAllOrders: async (params = {}) => {
    const response = await api.get('/orders', { params })
    return response.data
  },
  updateOrderStatus: async (id, status) => {
    const response = await api.put(`/orders/${id}/status`, { status })
    return response.data
  },
  getDashboardSummary: async () => {
    const response = await api.get('/orders/analytics/summary')
    return response.data
  },
  getRevenue: async (params = {}) => {
    const response = await api.get('/orders/analytics/revenue', { params })
    return response.data
  },
  getTopItems: async () => {
    const response = await api.get('/orders/analytics/top-items')
    return response.data
  },
}

export default orderService
