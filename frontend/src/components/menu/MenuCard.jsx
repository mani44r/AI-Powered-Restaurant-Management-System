import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { toast } from '../common/Toast'
import { formatCurrency } from '../../utils/formatCurrency'

const MenuCard = ({ item }) => {
  const { isAuthenticated, isAdmin } = useAuth()
  const { addToCart } = useCart()
  const [adding, setAdding] = useState(false)

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart')
      return
    }
    try {
      setAdding(true)
      await addToCart(item.id, 1)
      toast.success(`${item.name} added to cart!`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart')
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
      {/* Image */}
      <div className="relative overflow-hidden h-48">
        <img
          src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400' }}
        />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1">
          {item.is_vegetarian && (
            <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">🌿 Veg</span>
          )}
          {item.is_featured && (
            <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">⭐ Featured</span>
          )}
        </div>
        {!item.is_available && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold text-sm bg-red-500 px-3 py-1 rounded-full">Unavailable</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-gray-900 text-base leading-tight">{item.name}</h3>
          <span className="text-orange-600 font-bold text-base whitespace-nowrap">{formatCurrency(item.price)}</span>
        </div>
        <p className="text-gray-500 text-xs mb-1">{item.category_name}</p>
        {item.description && (
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">{item.description}</p>
        )}

        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-400">⏱ {item.preparation_time} mins</span>
          {!isAdmin && (
            <button
              onClick={handleAddToCart}
              disabled={!item.is_available || adding}
              className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              {adding ? '...' : '+ Add'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default MenuCard
