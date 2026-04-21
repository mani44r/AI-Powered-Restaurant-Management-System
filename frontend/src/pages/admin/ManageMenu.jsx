import { useState, useEffect } from 'react'
import menuService from '../../services/menuService'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { toast } from '../../components/common/Toast'
import { formatCurrency } from '../../utils/formatCurrency'

const EMPTY_FORM = { name: '', description: '', price: '', image_url: '', category_id: '', is_vegetarian: false, is_featured: false, is_available: true, preparation_time: 15 }

const ManageMenu = () => {
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')

  const fetchData = async () => {
    setLoading(true)
    const [itemsRes, catRes] = await Promise.all([
      menuService.getAllItems({ limit: 50, page: 1 }),
      menuService.getCategories(),
    ])
    setItems(itemsRes.data.items || [])
    setCategories(catRes.data.categories || [])
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const openForm = (item = null) => {
    setEditing(item)
    setForm(item ? { ...item, price: item.price } : EMPTY_FORM)
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) {
        await menuService.updateItem(editing.id, form)
        toast.success('Item updated successfully')
      } else {
        await menuService.createItem(form)
        toast.success('Item created successfully')
      }
      setShowForm(false)
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    try {
      await menuService.deleteItem(id)
      toast.success('Item deleted')
      fetchData()
    } catch { toast.error('Failed to delete item') }
  }

  const handleToggle = async (id) => {
    try {
      await menuService.toggleAvailability(id)
      fetchData()
    } catch { toast.error('Failed to update availability') }
  }

  const filtered = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Menu</h1>
        <button onClick={() => openForm()} className="bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors">
          + Add Item
        </button>
      </div>

      <div className="mb-4">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search items..."
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-orange-400 w-full max-w-xs" />
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Item</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Category</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Price</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={item.image_url || ''} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                        onError={(e) => { e.target.style.display = 'none' }} />
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-400">{item.is_vegetarian ? '🌿 Veg' : '🍖 Non-veg'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{item.category_name}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">{formatCurrency(item.price)}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleToggle(item.id)}
                      className={`text-xs px-2 py-1 rounded-full font-medium transition-colors ${item.is_available ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}>
                      {item.is_available ? 'Available' : 'Unavailable'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openForm(item)} className="text-blue-500 hover:text-blue-700 text-xs font-medium mr-3 transition-colors">Edit</button>
                    <button onClick={() => handleDelete(item.id, item.name)} className="text-red-400 hover:text-red-600 text-xs font-medium transition-colors">Delete</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="text-center py-10 text-gray-400">No items found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg my-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">{editing ? 'Edit Item' : 'Add New Item'}</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Item name *" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Description" rows={2} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
              <div className="grid grid-cols-2 gap-3">
                <input required type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
                  placeholder="Price *" className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
                <input type="number" value={form.preparation_time} onChange={e => setForm({ ...form, preparation_time: e.target.value })}
                  placeholder="Prep time (mins)" className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
              </div>
              <select required value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400">
                <option value="">Select category *</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <input value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })}
                placeholder="Image URL" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
              <div className="flex gap-6 text-sm">
                {[['is_vegetarian', 'Vegetarian'], ['is_featured', 'Featured'], ['is_available', 'Available']].map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form[key]} onChange={e => setForm({ ...form, [key]: e.target.checked })}
                      className="accent-orange-500" />
                    {label}
                  </label>
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 bg-orange-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-orange-600 disabled:opacity-60">
                  {saving ? 'Saving...' : (editing ? 'Update Item' : 'Add Item')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageMenu
