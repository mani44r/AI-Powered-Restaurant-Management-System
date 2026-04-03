import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { toast } from '../components/common/Toast'
import { formatCurrency } from '../utils/formatCurrency'
import orderService from '../services/orderService'
import LoadingSpinner from '../components/common/LoadingSpinner'

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, loading } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [orderForm, setOrderForm] = useState({ delivery_address: '', special_instructions: '', payment_method: 'cash' })
  const [placing, setPlacing] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const handleQuantityChange = async (itemId, newQty) => {
    try {
      if (newQty < 1) { await removeFromCart(itemId); return }
      await updateQuantity(itemId, newQty)
    } catch { toast.error('Failed to update quantity') }
  }

  const handleRemove = async (itemId, name) => {
    try {
      await removeFromCart(itemId)
      toast.info(`${name} removed from cart`)
    } catch { toast.error('Failed to remove item') }
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    if (!orderForm.delivery_address.trim()) { toast.error('Please enter delivery address'); return }
    setPlacing(true)
    try {
      const res = await orderService.placeOrder(orderForm)
      toast.success('Order placed successfully!')
      navigate(`/orders/${res.data.order.id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order')
    } finally {
      setPlacing(false)
    }
  }

  if (loading) return <LoadingSpinner />

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add some delicious items from our menu</p>
        <Link to="/menu" className="bg-orange-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors">
          Browse Menu
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Cart ({cart.itemCount} items)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3">
          {cart.items.map(item => (
            <div key={item.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 shadow-sm">
              <img src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'}
                alt={item.name} className="w-20 h-20 object-cover rounded-xl"
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100' }} />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-sm">{item.name}</h3>
                <p className="text-orange-600 font-bold text-sm">{formatCurrency(item.price)} each</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button onClick={() => handleQuantityChange(item.menu_item_id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-gray-600 font-bold transition-colors">−</button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item.menu_item_id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-gray-600 font-bold transition-colors">+</button>
                  </div>
                  <button onClick={() => handleRemove(item.menu_item_id, item.name)} className="text-red-400 hover:text-red-600 text-xs transition-colors">
                    Remove
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">{formatCurrency(item.subtotal)}</p>
              </div>
            </div>
          ))}
          <button onClick={() => { clearCart(); toast.info('Cart cleared') }}
            className="text-sm text-red-400 hover:text-red-600 mt-2 transition-colors">
            Clear cart
          </button>
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cart.itemCount} items)</span>
                <span>{formatCurrency(cart.total)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery fee</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-gray-900">
                <span>Total</span>
                <span className="text-orange-600">{formatCurrency(cart.total)}</span>
              </div>
            </div>
            <button onClick={() => setShowForm(true)}
              className="w-full mt-4 bg-orange-500 text-white font-semibold py-3 rounded-xl hover:bg-orange-600 transition-colors">
              Place Order →
            </button>
          </div>
        </div>
      </div>

      {/* Order Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Complete Your Order</h2>
            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Delivery Address *</label>
                <textarea value={orderForm.delivery_address}
                  onChange={e => setOrderForm({ ...orderForm, delivery_address: e.target.value })}
                  required rows={3} placeholder="Enter your full delivery address"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Special Instructions</label>
                <input value={orderForm.special_instructions}
                  onChange={e => setOrderForm({ ...orderForm, special_instructions: e.target.value })}
                  placeholder="Any special requests..." type="text"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Payment Method</label>
                <select value={orderForm.payment_method}
                  onChange={e => setOrderForm({ ...orderForm, payment_method: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400">
                  <option value="cash">Cash on Delivery</option>
                  <option value="upi">UPI</option>
                  <option value="card">Card</option>
                </select>
              </div>
              <div className="bg-orange-50 rounded-xl p-3 text-sm">
                <div className="flex justify-between font-bold">
                  <span>Total Amount:</span>
                  <span className="text-orange-600">{formatCurrency(cart.total)}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={placing}
                  className="flex-1 bg-orange-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-orange-600 disabled:opacity-60">
                  {placing ? 'Placing...' : 'Confirm Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart
