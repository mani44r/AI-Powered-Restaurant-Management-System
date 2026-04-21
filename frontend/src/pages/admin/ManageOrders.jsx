import { useState, useEffect } from 'react'
import orderService from '../../services/orderService'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { toast } from '../../components/common/Toast'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatDate } from '../../utils/formatCurrency'

const STATUS_OPTIONS = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled']
const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-orange-100 text-orange-800',
  ready: 'bg-teal-100 text-teal-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

const ManageOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [statusFilter, setStatusFilter] = useState('')
  const [selected, setSelected] = useState(null)
  const [orderDetail, setOrderDetail] = useState(null)

  const fetchOrders = async () => {
    setLoading(true)
    const res = await orderService.getAllOrders({ page, limit: 15, status: statusFilter || undefined })
    setOrders(res.data.orders)
    setTotal(res.data.total)
    setLoading(false)
  }

  useEffect(() => { fetchOrders() }, [page, statusFilter])

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await orderService.updateOrderStatus(orderId, status)
      toast.success('Status updated')
      fetchOrders()
      if (orderDetail?.id === orderId) setOrderDetail(prev => ({ ...prev, status }))
    } catch { toast.error('Failed to update status') }
  }

  const openDetail = async (order) => {
    setSelected(order.id)
    const res = await orderService.getOrderById(order.id)
    setOrderDetail(res.data.order)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Orders</h1>

      {/* Filter */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <button onClick={() => { setStatusFilter(''); setPage(1) }}
          className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${!statusFilter ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'}`}>
          All
        </button>
        {STATUS_OPTIONS.map(s => (
          <button key={s} onClick={() => { setStatusFilter(s); setPage(1) }}
            className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors capitalize ${statusFilter === s ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders List */}
        <div className="lg:col-span-2">
          {loading ? <LoadingSpinner /> : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Order</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Customer</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Amount</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map(order => (
                    <tr key={order.id} onClick={() => openDetail(order)}
                      className={`cursor-pointer hover:bg-orange-50 transition-colors ${selected === order.id ? 'bg-orange-50' : ''}`}>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-900">#{order.id}</p>
                        <p className="text-xs text-gray-400">{formatDate(order.created_at)}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-gray-800">{order.customer_name}</p>
                        <p className="text-xs text-gray-400">{order.item_count} items</p>
                      </td>
                      <td className="px-4 py-3 font-semibold">{formatCurrency(order.total_amount)}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${statusColors[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr><td colSpan={4} className="text-center py-10 text-gray-400">No orders found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          {Math.ceil(total / 15) > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 text-sm border rounded-lg disabled:opacity-40 hover:bg-gray-50">← Prev</button>
              <span className="px-4 py-2 text-sm text-gray-600">Page {page} of {Math.ceil(total / 15)}</span>
              <button disabled={page >= Math.ceil(total / 15)} onClick={() => setPage(p => p + 1)} className="px-4 py-2 text-sm border rounded-lg disabled:opacity-40 hover:bg-gray-50">Next →</button>
            </div>
          )}
        </div>

        {/* Order Detail */}
        <div>
          {orderDetail ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-20">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-gray-900">Order #{orderDetail.id}</h3>
                  <p className="text-xs text-gray-500">{formatDate(orderDetail.created_at)}</p>
                </div>
                <button onClick={() => { setSelected(null); setOrderDetail(null) }} className="text-gray-400 hover:text-gray-600 text-xs">✕</button>
              </div>
              <div className="text-sm space-y-1 mb-3">
                <p><span className="font-medium">Customer:</span> {orderDetail.customer_name}</p>
                <p><span className="font-medium">Email:</span> {orderDetail.customer_email}</p>
                {orderDetail.delivery_address && <p><span className="font-medium">Address:</span> {orderDetail.delivery_address}</p>}
              </div>
              <div className="space-y-2 mb-3">
                {orderDetail.items?.map((item, i) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span>{item.item_name} × {item.quantity}</span>
                    <span>{formatCurrency(item.subtotal)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-2 mb-4 flex justify-between font-bold text-sm">
                <span>Total</span>
                <span className="text-orange-600">{formatCurrency(orderDetail.total_amount)}</span>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-700 mb-2">Update Status:</p>
                <div className="grid grid-cols-2 gap-2">
                  {STATUS_OPTIONS.map(s => (
                    <button key={s} onClick={() => handleStatusUpdate(orderDetail.id, s)}
                      className={`text-xs py-1.5 rounded-lg border transition-colors capitalize ${orderDetail.status === s ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center text-gray-400">
              <p className="text-3xl mb-2">👆</p>
              <p className="text-sm">Click an order to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ManageOrders
