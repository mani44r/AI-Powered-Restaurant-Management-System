import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import MenuCard from '../components/menu/MenuCard'
import LoadingSpinner from '../components/common/LoadingSpinner'
import menuService from '../services/menuService'
import aiService from '../services/aiService'
import { toast } from '../components/common/Toast'
import { useAuth } from '../context/AuthContext'

const Home = () => {
  const { isAuthenticated } = useAuth()
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)
  const [aiRecommendations, setAiRecommendations] = useState([])
  const [aiLoading, setAiLoading] = useState(false)
  const [showAiForm, setShowAiForm] = useState(false)
  const [preferences, setPreferences] = useState({ dietary: 'No preference', mood: 'Regular meal', budget: '', spice: 'Medium' })

  useEffect(() => {
    menuService.getFeatured()
      .then(res => setFeatured(res.data.items || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const getAiRecommendations = async (e) => {
    e.preventDefault()
    setAiLoading(true)
    try {
      const res = await aiService.getRecommendations(preferences)
      setAiRecommendations(res.data.recommendations || [])
      setShowAiForm(false)
    } catch {
      toast.error('AI recommendations unavailable. Please try again.')
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-orange-500 to-red-600 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
            Authentic Indian Cuisine,<br />
            <span className="text-yellow-300">Powered by AI 🤖</span>
          </h1>
          <p className="text-orange-100 text-lg mb-8">
            Discover personalized recommendations, order your favorites, and let our AI guide your taste journey.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/menu" className="bg-white text-orange-600 font-semibold px-8 py-3 rounded-xl hover:bg-orange-50 transition-colors">
              Browse Menu
            </Link>
            <button
              onClick={() => setShowAiForm(true)}
              className="bg-orange-600 border-2 border-white text-white font-semibold px-8 py-3 rounded-xl hover:bg-orange-700 transition-colors"
            >
              🤖 AI Recommendations
            </button>
          </div>
        </div>
      </section>

      {/* AI Recommendation Form */}
      {showAiForm && (
        <section className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">🤖 Tell us your preferences</h2>
            <form onSubmit={getAiRecommendations} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Dietary Preference</label>
                <select value={preferences.dietary} onChange={e => setPreferences({ ...preferences, dietary: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400">
                  <option>No preference</option>
                  <option>Vegetarian only</option>
                  <option>Non-vegetarian</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Occasion / Mood</label>
                <select value={preferences.mood} onChange={e => setPreferences({ ...preferences, mood: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400">
                  <option>Regular meal</option>
                  <option>Celebration</option>
                  <option>Quick bite</option>
                  <option>Light & healthy</option>
                  <option>Comfort food</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Budget (₹)</label>
                <input type="number" placeholder="e.g. 500" value={preferences.budget}
                  onChange={e => setPreferences({ ...preferences, budget: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Spice Level</label>
                <select value={preferences.spice} onChange={e => setPreferences({ ...preferences, spice: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400">
                  <option>Mild</option>
                  <option>Medium</option>
                  <option>Hot</option>
                  <option>Extra Hot</option>
                </select>
              </div>
              <div className="sm:col-span-2 flex gap-3 justify-end">
                <button type="button" onClick={() => setShowAiForm(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={aiLoading} className="px-6 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-60">
                  {aiLoading ? 'Getting recommendations...' : 'Get Recommendations ✨'}
                </button>
              </div>
            </form>
          </div>
        </section>
      )}

      {/* AI Recommendations Results */}
      {aiRecommendations.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">✨ AI Recommendations For You</h2>
            <button onClick={() => setAiRecommendations([])} className="text-sm text-gray-500 hover:text-gray-700">Clear</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {aiRecommendations.map((rec, i) => (
              <div key={i} className="bg-gradient-to-br from-orange-50 to-white rounded-2xl border border-orange-100 p-4 shadow-sm">
                {rec.image_url && (
                  <img src={rec.image_url} alt={rec.name} className="w-full h-36 object-cover rounded-xl mb-3"
                    onError={(e) => { e.target.style.display = 'none' }} />
                )}
                <h3 className="font-semibold text-gray-900">{rec.name}</h3>
                <p className="text-orange-600 font-bold text-sm">₹{rec.price}</p>
                <p className="text-gray-500 text-xs mt-1">{rec.reason}</p>
                <Link to="/menu" className="mt-3 block text-center text-xs bg-orange-500 text-white py-1.5 rounded-lg hover:bg-orange-600">
                  Order Now →
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Featured Items */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">⭐ Featured Dishes</h2>
          <Link to="/menu" className="text-orange-600 text-sm font-medium hover:underline">View all →</Link>
        </div>
        {loading ? <LoadingSpinner /> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {featured.map(item => <MenuCard key={item.id} item={item} />)}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-orange-50 py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Ready to Order?</h2>
          <p className="text-gray-600 mb-6">Browse our full menu and get your favorite dishes delivered hot and fresh.</p>
          <Link to="/menu" className="bg-orange-500 text-white font-semibold px-10 py-3 rounded-xl hover:bg-orange-600 transition-colors">
            View Full Menu
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
