import { createContext, useContext, useState, useEffect } from 'react'
import cartService from '../services/cartService'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total: 0, itemCount: 0 })
  const [loading, setLoading] = useState(false)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) fetchCart()
    else setCart({ items: [], total: 0, itemCount: 0 })
  }, [isAuthenticated])

  const fetchCart = async () => {
    try {
      setLoading(true)
      const res = await cartService.getCart()
      setCart(res.data.cart)
    } catch { /* silent */ }
    finally { setLoading(false) }
  }

  const addToCart = async (menuItemId, quantity = 1) => {
    const res = await cartService.addToCart(menuItemId, quantity)
    setCart(res.data.cart)
    return res
  }

  const updateQuantity = async (itemId, quantity) => {
    const res = await cartService.updateQuantity(itemId, quantity)
    setCart(res.data.cart)
  }

  const removeFromCart = async (itemId) => {
    const res = await cartService.removeFromCart(itemId)
    setCart(res.data.cart)
  }

  const clearCart = async () => {
    const res = await cartService.clearCart()
    setCart(res.data.cart)
  }

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateQuantity, removeFromCart, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used inside CartProvider')
  return context
}

export default CartContext
