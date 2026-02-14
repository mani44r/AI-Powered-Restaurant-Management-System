import api from './api'

const cartService = {
  getCart: async () => {
    const response = await api.get('/cart')
    return response.data
  },
  addToCart: async (menu_item_id, quantity = 1) => {
    const response = await api.post('/cart', { menu_item_id, quantity })
    return response.data
  },
  updateQuantity: async (itemId, quantity) => {
    const response = await api.put(`/cart/${itemId}`, { quantity })
    return response.data
  },
  removeFromCart: async (itemId) => {
    const response = await api.delete(`/cart/${itemId}`)
    return response.data
  },
  clearCart: async () => {
    const response = await api.delete('/cart/clear')
    return response.data
  },
}

export default cartService
