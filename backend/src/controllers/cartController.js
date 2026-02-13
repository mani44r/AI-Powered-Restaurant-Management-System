import cartService from '../services/cartService.js'

const cartController = {
  getCart: async (req, res, next) => {
    try {
      const cart = await cartService.getCart(req.user.userId)
      res.json({ status: 'success', data: { cart } })
    } catch (err) { next(err) }
  },

  addToCart: async (req, res, next) => {
    try {
      const { menu_item_id, quantity = 1 } = req.body
      if (!menu_item_id) return res.status(400).json({ status: 'fail', message: 'menu_item_id is required' })
      const cart = await cartService.addToCart(req.user.userId, menu_item_id, quantity)
      res.json({ status: 'success', message: 'Item added to cart', data: { cart } })
    } catch (err) { next(err) }
  },

  updateQuantity: async (req, res, next) => {
    try {
      const { quantity } = req.body
      const cart = await cartService.updateQuantity(req.user.userId, parseInt(req.params.itemId), quantity)
      res.json({ status: 'success', data: { cart } })
    } catch (err) { next(err) }
  },

  removeFromCart: async (req, res, next) => {
    try {
      const cart = await cartService.removeFromCart(req.user.userId, parseInt(req.params.itemId))
      res.json({ status: 'success', message: 'Item removed from cart', data: { cart } })
    } catch (err) { next(err) }
  },

  clearCart: async (req, res, next) => {
    try {
      const cart = await cartService.clearCart(req.user.userId)
      res.json({ status: 'success', message: 'Cart cleared', data: { cart } })
    } catch (err) { next(err) }
  },
}

export default cartController
