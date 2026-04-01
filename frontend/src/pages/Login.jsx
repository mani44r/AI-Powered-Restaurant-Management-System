import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { toast } from '../components/common/Toast'

const Login = () => {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  if (isAuthenticated) { navigate('/'); return null }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await login(form)
      toast.success(`Welcome back, ${res.user.name.split(' ')[0]}!`)
      navigate(res.user.role === 'admin' ? '/admin' : from, { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-5xl">🍽️</span>
          <h1 className="text-2xl font-bold text-gray-900 mt-3">Welcome back</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your Spice Garden account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email" name="email" value={form.email} onChange={handleChange} required
                placeholder="you@example.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'} name="password" value={form.password}
                  onChange={handleChange} required placeholder="Enter your password"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs">
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors text-sm">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-4 p-3 bg-orange-50 rounded-lg text-xs text-gray-600">
            <p className="font-medium text-gray-700 mb-1">Demo credentials:</p>
            <p>Admin: admin@restaurant.com / Admin@123</p>
          </div>

          <p className="text-center text-sm text-gray-600 mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="text-orange-600 font-medium hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
