import { useState, useEffect, useCallback } from 'react'
import MenuCard from '../components/menu/MenuCard'
import LoadingSpinner from '../components/common/LoadingSpinner'
import menuService from '../services/menuService'

const Menu = () => {
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({ category: '', search: '' })
  const [searchInput, setSearchInput] = useState('')

  const fetchItems = useCallback(async () => {
    setLoading(true)
    try {
      const res = await menuService.getAllItems({ ...filters, page, limit: 12 })
      setItems(res.data.items)
      setTotal(res.data.total)
    } catch { /* silent */ }
    finally { setLoading(false) }
  }, [filters, page])

  useEffect(() => { fetchItems() }, [fetchItems])
  useEffect(() => {
    menuService.getCategories().then(res => setCategories(res.data.categories || []))
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    setFilters(f => ({ ...f, search: searchInput }))
    setPage(1)
  }

  const handleCategory = (cat) => {
    setFilters(f => ({ ...f, category: cat === f.category ? '' : cat }))
    setPage(1)
  }

  const totalPages = Math.ceil(total / 12)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Our Menu</h1>
        <p className="text-gray-500">Authentic Indian flavors, made fresh daily</p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search dishes..."
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400"
        />
        <button type="submit" className="bg-orange-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors">
          Search
        </button>
        {(filters.search || filters.category) && (
          <button type="button" onClick={() => { setFilters({ category: '', search: '' }); setSearchInput(''); setPage(1) }}
            className="text-sm text-gray-500 border border-gray-200 px-4 py-2.5 rounded-xl hover:bg-gray-50">
            Clear
          </button>
        )}
      </form>

      {/* Categories */}
      <div className="flex gap-2 flex-wrap mb-6">
        <button
          onClick={() => handleCategory('')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${!filters.category ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-700 border-gray-200 hover:border-orange-400'}`}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => handleCategory(cat.name)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${filters.category === cat.name ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-700 border-gray-200 hover:border-orange-400'}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Results count */}
      {!loading && <p className="text-sm text-gray-500 mb-4">{total} items found</p>}

      {/* Grid */}
      {loading ? <LoadingSpinner /> : items.length === 0 ? (
        <div className="text-center py-16">
          <span className="text-5xl">🍽️</span>
          <p className="text-gray-500 mt-3">No items found. Try a different search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {items.map(item => <MenuCard key={item.id} item={item} />)}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">
            ← Prev
          </button>
          <span className="px-4 py-2 text-sm text-gray-600">Page {page} of {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">
            Next →
          </button>
        </div>
      )}
    </div>
  )
}

export default Menu
