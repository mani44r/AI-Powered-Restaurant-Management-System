import cartModel from '../models/cartModel.js'
import menuModel from '../models/menuModel.js'
import ApiError from '../utils/apiError.js'

const cartService = {
  getCart: async (userId) => {
    const items = await cartModel.findByUser(userId)
    const total = items.reduce((sum, item) => sum + parseFloat(item.subtotal), 0)
    return { items, total, itemCount: items.length }
  },

  addToCart: async (userId, menuItemId, quantity = 1) => {
    if (quantity < 1) throw new ApiError(400, 'Quantity must be at least 1')
    if (quantity > 20) throw new ApiError(400, 'Maximum quantity per item is 20')

    const item = await menuModel.findById(menuItemId)
    if (!item) throw new ApiError(404, 'Menu item not found')
    if (!item.is_available) throw new ApiError(400, 'This item is currently unavailable')

    await cartModel.upsert(userId, menuItemId, quantity)
    return cartService.getCart(userId)
  },

  updateQuantity: async (userId, menuItemId, quantity) => {
    if (quantity < 1) throw new ApiError(400, 'Quantity must be at least 1')
    await cartModel.upsert(userId, menuItemId, quantity)
    return cartService.getCart(userId)
  },

  removeFromCart: async (userId, menuItemId) => {
    await cartModel.removeItem(userId, menuItemId)
    return cartService.getCart(userId)
  },

  clearCart: async (userId) => {
    await cartModel.clearCart(userId)
    return { items: [], total: 0, itemCount: 0 }
  },
}

export default cartService
