/*
  WHY THIS FILE EXISTS:
  AuthContext provides the logged-in user's data to EVERY component 
  in the app without prop drilling.

  WHAT IS PROP DRILLING?
  If you store user data in App.jsx and need it in a deeply nested 
  component, you'd have to pass it as props through 5+ intermediate 
  components that don't even use it. Context solves this.

  RESPONSIBILITY:
  - Stores: current user object, loading state, isAuthenticated boolean
  - Provides: login(), logout(), register() functions globally
  - On app load: checks if a token exists in localStorage (auto-login)

  HOW IT COMMUNICATES:
  - Wraps the entire app in App.jsx
  - Any component can call useAuth() hook to access this data
  - Uses authService.js for actual API calls

  INTERVIEW QUESTION:
  Q: When would you use Context vs a state management library like Redux?
  A: Context is great for low-frequency updates like auth state, theme, 
     language. Redux (or Zustand) is better when many components update 
     state frequently (like a real-time cart with many interactions).
*/

import { createContext, useContext, useState, useEffect } from 'react'
import authService from '../services/authService'

// Step 1: Create the context object
const AuthContext = createContext(null)

// Step 2: Create the Provider component
// This wraps the app and "provides" the value to all children
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true) // true while checking localStorage

  // On app load, check if user is already logged in
  useEffect(() => {
    const savedUser = authService.getCurrentUser()
    if (savedUser) {
      setUser(savedUser)
    }
    setLoading(false) // Done checking
  }, [])

  // Login: call API, then update local state
  const login = async (credentials) => {
    const data = await authService.login(credentials)
    setUser(data.user)
    return data
  }

  // Register: call API (user must login separately after registering)
  const register = async (userData) => {
    const data = await authService.register(userData)
    return data
  }

  // Logout: clear API service storage + update local state
  const logout = () => {
    authService.logout()
    setUser(null)
  }

  // The value object — everything that any component can access
  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,                          // true if user exists
    isAdmin: user?.role === 'admin',                  // true if admin
  }

  return (
    <AuthContext.Provider value={value}>
      {/* Don't render children until we've checked localStorage */}
      {!loading && children}
    </AuthContext.Provider>
  )
}

// Step 3: Custom hook for easy consumption
// Instead of: const { user } = useContext(AuthContext)
// We write:    const { user } = useAuth()
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider')
  }
  return context
}

export default AuthContext
