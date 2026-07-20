import { Link } from 'react-router-dom'

const Footer = () => (
  <footer className="bg-gray-900 text-gray-400 mt-auto">
    <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {/* Brand */}
      <div className="lg:col-span-1">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-3xl">🍽️</span>
          <span className="text-white font-bold text-xl">Spice Garden</span>
        </div>
        <p className="text-sm leading-relaxed">
          Authentic Indian cuisine crafted with love and passion, now powered by AI to give you a personalized dining experience.
        </p>
        <div className="flex gap-3 mt-4">
          <a href="#" aria-label="Instagram" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors text-sm">📸</a>
          <a href="#" aria-label="Twitter" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors text-sm">🐦</a>
          <a href="#" aria-label="Facebook" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors text-sm">📘</a>
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Quick Links</h4>
        <ul className="space-y-2 text-sm">
          {[['/', 'Home'], ['/menu', 'Menu'], ['/cart', 'Cart'], ['/orders', 'My Orders']].map(([to, label]) => (
            <li key={to}>
              <Link to={to} className="hover:text-orange-400 transition-colors flex items-center gap-1">
                <span className="text-orange-500 text-xs">→</span> {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Categories */}
      <div>
        <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Our Menu</h4>
        <ul className="space-y-2 text-sm">
          {['Starters', 'Main Course', 'Breads', 'Rice & Biryani', 'Desserts', 'Beverages'].map(cat => (
            <li key={cat}>
              <Link to={`/menu?category=${cat}`} className="hover:text-orange-400 transition-colors flex items-center gap-1">
                <span className="text-orange-500 text-xs">→</span> {cat}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Contact */}
      <div>
        <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Contact Us</h4>
        <ul className="space-y-3 text-sm">
          <li className="flex items-start gap-2">
            <span className="mt-0.5">📍</span>
            <span>123 Food Street, Koramangala<br />Bangalore, Karnataka 560034</span>
          </li>
          <li className="flex items-center gap-2">
            <span>📞</span>
            <a href="tel:+919876543210" className="hover:text-orange-400 transition-colors">+91 98765 43210</a>
          </li>
          <li className="flex items-center gap-2">
            <span>✉️</span>
            <a href="mailto:hello@spicegarden.in" className="hover:text-orange-400 transition-colors">hello@spicegarden.in</a>
          </li>
          <li className="flex items-center gap-2">
            <span>🕐</span>
            <span>11:00 AM – 11:00 PM Daily</span>
          </li>
        </ul>
      </div>
    </div>

    <div className="border-t border-gray-800 py-4 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-600">
        <p>© {new Date().getFullYear()} Spice Garden. All rights reserved.</p>
        <p>Made with ❤️ and powered by AI 🤖</p>
      </div>
    </div>
  </footer>
)

export default Footer
