import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import orderService from '../services/orderService'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { formatCurrency } from '../utils/formatCurrency'
import { formatDate } from '../utils/formatCurrency'

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-orange-100 text-orange-800',
  ready: 'bg-teal-100 text-teal-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

const OrderDetail = ({ orderId, onBack }) => {
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    orderService.getOrderById(orderId)
      .then(res => setOrder(res.data.order))
      .finally(() => setLoading(false))
  }, [orderId])

  if (loading) return <LoadingSpinner />
  if (!order) return <p className="text-center text-gray-500">Order not found</p>

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors">
        ← Back to Orders
      </button>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Order #{order.id}</h2>
            <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
          </div>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${statusColors[order.status]}`}>
            {order.status}
          </span>
        </div>
        <div className="space-y-3 mb-4">
          {order.items?.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-gray-700">{item.item_name} × {item.quantity}</span>
              <span className="font-medium">{formatCurrency(item.subtotal)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 pt-3 space-y-1 text-sm">
          {order.delivery_address && <p className="text-gray-600"><span className="font-medium">Address:</span> {order.delivery_address}</p>}
          {order.special_instructions && <p className="text-gray-600"><span className="font-medium">Instructions:</span> {order.special_instructions}</p>}
          <p className="text-gray-600"><span className="font-medium">Payment:</span> {order.payment_method} ({order.payment_status})</p>
        </div>
        <div className="border-t border-gray-100 pt-3 mt-3 flex justify-between font-bold">
          <span>Total</span>
          <span className="text-orange-600">{formatCurrency(order.total_amount)}</span>
        </div>
      </div>
    </div>
  )
}

const OrderHistory = () => {
  const { id } = useParams()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(id || null)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    orderService.getMyOrders({ page })
      .then(res => { setOrders(res.data.orders); setTotal(res.data.total) })
      .finally(() => setLoading(false))
  }, [page])

  useEffect(() => { if (id) setSelectedOrder(id) }, [id])

  if (selectedOrder) return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <OrderDetail orderId={selectedOrder} onBack={() => setSelectedOrder(null)} />
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>
      {loading ? <LoadingSpinner /> : orders.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-3">📋</div>
          <p className="text-gray-500 mb-4">No orders yet</p>
          <Link to="/menu" className="bg-orange-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors">
            Start Ordering
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map(order => (
            <button key={order.id} onClick={() => setSelectedOrder(order.id)}
              className="w-full bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md hover:border-orange-200 transition-all text-left">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Order #{order.id}</p>
                  <p className="text-gray-500 text-xs">{formatDate(order.created_at)} · {order.item_count} items</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-orange-600 text-sm">{formatCurrency(order.total_amount)}</p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
      {Math.ceil(total / 10) > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 text-sm border rounded-lg disabled:opacity-40 hover:bg-gray-50">← Prev</button>
          <button disabled={page >= Math.ceil(total / 10)} onClick={() => setPage(p => p + 1)} className="px-4 py-2 text-sm border rounded-lg disabled:opacity-40 hover:bg-gray-50">Next →</button>
        </div>
      )}
    </div>
  )
}

export default OrderHistory
