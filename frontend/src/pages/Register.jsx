import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { toast } from '../components/common/Toast'

const Register = () => {
  const { register, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) { navigate('/'); return null }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      await register(form)
      toast.success('Account created! Please login.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-5xl">🍽️</span>
          <h1 className="text-2xl font-bold text-gray-900 mt-3">Create Account</h1>
          <p className="text-gray-500 text-sm mt-1">Join Spice Garden for great food</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { name: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe', required: true },
              { name: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com', required: true },
              { name: 'phone', label: 'Phone Number (optional)', type: 'tel', placeholder: '+91 98765 43210', required: false },
              { name: 'password', label: 'Password', type: 'password', placeholder: 'Min 6 characters', required: true },
            ].map(field => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                <input
                  type={field.type} name={field.name} value={form[field.name]}
                  onChange={handleChange} required={field.required} placeholder={field.placeholder}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                />
              </div>
            ))}
            <button type="submit" disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors text-sm mt-2">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-orange-600 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
