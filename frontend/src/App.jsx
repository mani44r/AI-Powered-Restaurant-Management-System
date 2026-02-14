import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import ToastContainer from './components/common/Toast'
import Chatbot from './components/ai/Chatbot'
import ProtectedRoute, { AdminRoute } from './components/common/ProtectedRoute'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Menu from './pages/Menu'
import Cart from './pages/Cart'
import OrderHistory from './pages/OrderHistory'
import Dashboard from './pages/admin/Dashboard'
import ManageMenu from './pages/admin/ManageMenu'
import ManageOrders from './pages/admin/ManageOrders'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/menu" element={<Menu />} />

                {/* Customer Protected */}
                <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
                <Route path="/orders/:id" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />

                {/* Admin Protected */}
                <Route path="/admin" element={<AdminRoute><Dashboard /></AdminRoute>} />
                <Route path="/admin/menu" element={<AdminRoute><ManageMenu /></AdminRoute>} />
                <Route path="/admin/orders" element={<AdminRoute><ManageOrders /></AdminRoute>} />

                {/* 404 */}
                <Route path="*" element={
                  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                    <p className="text-6xl mb-4">🍽️</p>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Page Not Found</h1>
                    <p className="text-gray-500 mb-6">The page you're looking for doesn't exist.</p>
                    <a href="/" className="bg-orange-500 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-orange-600 transition-colors">Go Home</a>
                  </div>
                } />
              </Routes>
            </main>
            <Footer />
            <Chatbot />
            <ToastContainer />
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
