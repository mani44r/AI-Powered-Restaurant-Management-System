import { Link } from 'react-router-dom'

const Footer = () => (
  <footer className="bg-gray-900 text-gray-400 mt-auto">
    <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">🍽️</span>
          <span className="text-white font-bold text-lg">Spice Garden</span>
        </div>
        <p className="text-sm">Authentic Indian cuisine crafted with love, powered by AI.</p>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-3">Quick Links</h4>
        <ul className="space-y-2 text-sm">
          <li><Link to="/" className="hover:text-orange-400 transition-colors">Home</Link></li>
          <li><Link to="/menu" className="hover:text-orange-400 transition-colors">Menu</Link></li>
          <li><Link to="/cart" className="hover:text-orange-400 transition-colors">Cart</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-3">Contact</h4>
        <ul className="space-y-2 text-sm">
          <li>📍 123 Food Street, Bangalore</li>
          <li>📞 +91 98765 43210</li>
          <li>🕐 11 AM – 11 PM Daily</li>
        </ul>
      </div>
    </div>
    <div className="border-t border-gray-800 text-center py-4 text-xs text-gray-600">
      © {new Date().getFullYear()} Spice Garden. All rights reserved.
    </div>
  </footer>
)

export default Footer
