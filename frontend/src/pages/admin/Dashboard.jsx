import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import orderService from '../../services/orderService'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { formatCurrency } from '../../utils/formatCurrency'

const StatCard = ({ label, value, icon, color }) => (
  <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5`}>
    <div className="flex items-center justify-between mb-3">
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <span className={`text-2xl`}>{icon}</span>
    </div>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
  </div>
)

const Dashboard = () => {
  const [summary, setSummary] = useState(null)
  const [topItems, setTopItems] = useState([])
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      orderService.getDashboardSummary(),
      orderService.getTopItems(),
      orderService.getAllOrders({ limit: 5, page: 1 }),
    ]).then(([s, t, r]) => {
      setSummary(s.data.summary)
      setTopItems(t.data.items)
      setRecentOrders(r.data.orders)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  const statusColors = {
    pending: 'text-yellow-600 bg-yellow-50',
    confirmed: 'text-blue-600 bg-blue-50',
    preparing: 'text-orange-600 bg-orange-50',
    ready: 'text-teal-600 bg-teal-50',
    delivered: 'text-green-600 bg-green-50',
    cancelled: 'text-red-600 bg-red-50',
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/menu" className="bg-orange-500 text-white text-sm px-4 py-2 rounded-xl hover:bg-orange-600 transition-colors">Manage Menu</Link>
          <Link to="/admin/orders" className="bg-white border border-gray-200 text-gray-700 text-sm px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors">View Orders</Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Revenue" value={formatCurrency(summary?.totalRevenue || 0)} icon="💰" color="text-green-600" />
        <StatCard label="Total Orders" value={summary?.totalOrders || 0} icon="📦" color="text-blue-600" />
        <StatCard label="Customers" value={summary?.totalCustomers || 0} icon="👥" color="text-purple-600" />
        <StatCard label="Today's Orders" value={summary?.todayOrders || 0} icon="📅" color="text-orange-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm text-orange-600 hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {recentOrders.map(order => (
              <div key={order.id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium text-gray-900">#{order.id} — {order.customer_name}</p>
                  <p className="text-gray-500 text-xs">{order.item_count} items</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatCurrency(order.total_amount)}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusColors[order.status]}`}>{order.status}</span>
                </div>
              </div>
            ))}
            {recentOrders.length === 0 && <p className="text-gray-400 text-sm text-center py-4">No orders yet</p>}
          </div>
        </div>

        {/* Top Items */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-900 mb-4">Top Selling Items</h2>
          <div className="space-y-3">
            {topItems.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-6 h-6 flex items-center justify-center bg-orange-100 text-orange-600 rounded-full text-xs font-bold">{i + 1}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.total_sold} sold</p>
                </div>
                <p className="text-sm font-semibold text-green-600">{formatCurrency(item.total_revenue)}</p>
              </div>
            ))}
            {topItems.length === 0 && <p className="text-gray-400 text-sm text-center py-4">No sales data yet</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
