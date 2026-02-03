-- ============================================================
-- AI Restaurant Management System - Database Schema
-- Run this file once to create all tables in PostgreSQL
-- ============================================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Menu categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Menu items table
CREATE TABLE IF NOT EXISTS menu_items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  is_available BOOLEAN DEFAULT TRUE,
  is_vegetarian BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  preparation_time INTEGER DEFAULT 15,
  rating DECIMAL(3,2) DEFAULT 0.0,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')),
  total_amount DECIMAL(10, 2) NOT NULL,
  delivery_address TEXT,
  special_instructions TEXT,
  payment_method VARCHAR(30) DEFAULT 'cash',
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Order items table (junction between orders and menu_items)
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id INTEGER REFERENCES menu_items(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Cart table (persistent cart per user)
CREATE TABLE IF NOT EXISTS cart_items (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  menu_item_id INTEGER REFERENCES menu_items(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, menu_item_id)
);

-- ============================================================
-- SEED DATA - Default categories and sample menu items
-- ============================================================

-- Insert categories
INSERT INTO categories (name, description) VALUES
  ('Starters', 'Appetizers and small plates to start your meal'),
  ('Main Course', 'Hearty main dishes for a satisfying meal'),
  ('Breads', 'Fresh baked breads and rotis'),
  ('Rice & Biryani', 'Fragrant rice dishes and biryani'),
  ('Desserts', 'Sweet treats to end your meal'),
  ('Beverages', 'Refreshing drinks and beverages')
ON CONFLICT (name) DO NOTHING;

-- Insert sample menu items
INSERT INTO menu_items (name, description, price, image_url, category_id, is_vegetarian, is_featured, preparation_time) VALUES
  ('Paneer Tikka', 'Cottage cheese marinated in spiced yogurt, grilled to perfection', 280.00, 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400', 1, TRUE, TRUE, 20),
  ('Chicken Tikka', 'Tender chicken marinated in yogurt and spices, cooked in tandoor', 320.00, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400', 1, FALSE, TRUE, 25),
  ('Veg Samosa (2 pcs)', 'Crispy pastry filled with spiced potatoes and peas', 120.00, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400', 1, TRUE, FALSE, 10),
  ('Dal Makhani', 'Slow-cooked black lentils in buttery tomato sauce', 260.00, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400', 2, TRUE, TRUE, 30),
  ('Butter Chicken', 'Tender chicken in rich, creamy tomato-based sauce', 380.00, 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400', 2, FALSE, TRUE, 35),
  ('Palak Paneer', 'Fresh cottage cheese in a smooth, spiced spinach gravy', 280.00, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400', 2, TRUE, FALSE, 25),
  ('Chicken Biryani', 'Fragrant basmati rice cooked with chicken and whole spices', 420.00, 'https://images.unsplash.com/photo-1563379091339-03246963d651?w=400', 4, FALSE, TRUE, 40),
  ('Veg Biryani', 'Aromatic basmati rice with seasonal vegetables and saffron', 320.00, 'https://images.unsplash.com/photo-1563379091339-03246963d651?w=400', 4, TRUE, FALSE, 35),
  ('Garlic Naan', 'Soft leavened bread with garlic and butter, baked in tandoor', 80.00, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400', 3, TRUE, FALSE, 10),
  ('Butter Roti', 'Whole wheat unleavened bread with butter', 50.00, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400', 3, TRUE, FALSE, 8),
  ('Gulab Jamun (2 pcs)', 'Soft milk-solid balls soaked in rose-flavored sugar syrup', 150.00, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400', 5, TRUE, FALSE, 5),
  ('Rasgulla (2 pcs)', 'Soft cottage cheese balls in light sugar syrup', 130.00, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400', 5, TRUE, FALSE, 5),
  ('Mango Lassi', 'Thick, sweet yogurt drink blended with fresh mango', 120.00, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400', 6, TRUE, FALSE, 5),
  ('Masala Chai', 'Traditional Indian spiced milk tea', 60.00, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400', 6, TRUE, FALSE, 5),
  ('Shahi Paneer', 'Rich cottage cheese in a creamy cashew and tomato gravy', 320.00, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400', 2, TRUE, TRUE, 30)
ON CONFLICT DO NOTHING;

-- Create default admin user (password: Admin@123)
-- bcrypt hash for 'Admin@123' with salt rounds 12
INSERT INTO users (name, email, password, role) VALUES
  ('Admin User', 'admin@restaurant.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQyCgfl9IFH/bT0a.qGc/Y3Ci', 'admin')
ON CONFLICT (email) DO NOTHING;
