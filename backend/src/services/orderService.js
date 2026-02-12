import orderModel from '../models/orderModel.js'
import cartModel from '../models/cartModel.js'
import menuModel from '../models/menuModel.js'
import ApiError from '../utils/apiError.js'

const orderService = {
  placeOrder: async (userId, { delivery_address, special_instructions, payment_method }) => {
    // Get cart items
    const cartItems = await cartModel.findByUser(userId)
    if (!cartItems.length) throw new ApiError(400, 'Your cart is empty')

    // Validate all items are still available
    for (const item of cartItems) {
      if (!item.is_available) {
        throw new ApiError(400, `"${item.name}" is currently unavailable. Please remove it from your cart.`)
      }
    }

    // Calculate total
    const total_amount = cartItems.reduce((sum, item) => sum + parseFloat(item.subtotal), 0)

    // Create order
    const order = await orderModel.create({
      user_id: userId,
      total_amount,
      delivery_address,
      special_instructions,
      payment_method,
    })

    // Add order items with snapshot prices
    const orderItems = cartItems.map(item => ({
      menu_item_id: item.menu_item_id,
      quantity: item.quantity,
      unit_price: item.price,
      subtotal: item.subtotal,
    }))
    await orderModel.addItems(order.id, orderItems)

    // Clear the cart after placing order
    await cartModel.clearCart(userId)

    return orderModel.findById(order.id)
  },

  getMyOrders: async (userId, query) => {
    return orderModel.findByUser(userId, query)
  },

  getOrderById: async (orderId, userId, isAdmin) => {
    const order = await orderModel.findById(orderId)
    if (!order) throw new ApiError(404, 'Order not found')
    if (!isAdmin && order.user_id !== userId) throw new ApiError(403, 'Access denied')
    return order
  },

  getAllOrders: async (query) => {
    return orderModel.findAll(query)
  },

  updateOrderStatus: async (orderId, status) => {
    const valid = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled']
    if (!valid.includes(status)) throw new ApiError(400, 'Invalid order status')
    const order = await orderModel.findById(orderId)
    if (!order) throw new ApiError(404, 'Order not found')
    return orderModel.updateStatus(orderId, status)
  },

  getDashboardSummary: async () => {
    return orderModel.getSummary()
  },

  getRevenue: async (startDate, endDate) => {
    return orderModel.getRevenue(startDate, endDate)
  },

  getTopItems: async () => {
    return orderModel.getTopItems(5)
  },
}

export default orderService
