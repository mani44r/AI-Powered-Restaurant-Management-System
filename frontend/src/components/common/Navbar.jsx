import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth()
  const { cart } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMobileOpen(false)
  }

  const navLink = (to, label) => (
    <Link
      to={to}
      onClick={() => setMobileOpen(false)}
      className={`text-sm font-medium transition-colors hover:text-orange-600 ${location.pathname === to ? 'text-orange-600' : 'text-gray-700'}`}
    >
      {label}
    </Link>
  )

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🍽️</span>
            <span className="text-xl font-bold text-orange-600 hidden sm:block">Spice Garden</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLink('/', 'Home')}
            {navLink('/menu', 'Menu')}
            {isAuthenticated && !isAdmin && navLink('/orders', 'My Orders')}
            {isAdmin && navLink('/admin', 'Dashboard')}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {!isAdmin && (
                  <Link to="/cart" className="relative p-2 text-gray-700 hover:text-orange-600 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-4H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {cart.itemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {cart.itemCount}
                      </span>
                    )}
                  </Link>
                )}
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">Hi, {user?.name?.split(' ')[0]}</span>
                  <button
                    onClick={handleLogout}
                    className="text-sm bg-orange-50 text-orange-600 border border-orange-200 px-3 py-1.5 rounded-lg hover:bg-orange-100 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-gray-700 hover:text-orange-600 font-medium">Login</Link>
                <Link to="/register" className="text-sm bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-gray-700"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-4">
          {navLink('/', 'Home')}
          {navLink('/menu', 'Menu')}
          {isAuthenticated && !isAdmin && navLink('/orders', 'My Orders')}
          {isAuthenticated && !isAdmin && navLink('/cart', `Cart (${cart.itemCount})`)}
          {isAdmin && navLink('/admin', 'Dashboard')}
          {isAuthenticated ? (
            <button onClick={handleLogout} className="text-left text-sm text-red-500 font-medium">Logout</button>
          ) : (
            <div className="flex gap-3">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="text-sm text-gray-700 font-medium">Login</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="text-sm text-orange-600 font-medium">Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
