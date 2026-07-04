# 🍽️ AI-Powered Restaurant Management System

A full-stack AI-powered restaurant management system featuring an intelligent chatbot assistant, AI food recommendations, online ordering, cart management, and a complete admin panel.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Environment Variables](#environment-variables)
- [Architecture](#architecture)
- [API Endpoints](#api-endpoints)
- [Database Models](#database-models)
- [AI Features](#ai-features)
- [Authentication](#authentication)
- [Seeded Data](#seeded-data)
- [Frontend Pages](#frontend-pages)
- [Components](#components)
- [Services](#services)
- [Running the Application](#running-the-application)
- [Deployment](#deployment)

---

## Overview

An AI-Powered Restaurant Management System that combines a beautiful customer-facing interface with intelligent AI features. Customers can browse the menu, add items to cart, place orders, and interact with an AI assistant for personalized food recommendations. Admins get a full dashboard to manage menu items, track orders, and view analytics.

**Key Features:**
- Browse full menu with category filters and search
- Add to cart, update quantities, place orders with delivery address
- AI food recommendation engine based on user preferences
- AI chatbot assistant for menu queries and restaurant information
- Order history with real-time status tracking
- Admin dashboard with revenue analytics and top-selling items
- Admin menu management (CRUD + availability toggle)
- Admin order management with status updates
- JWT-based authentication with role-based access control
- Fully responsive UI built with Tailwind CSS

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | React 19 |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS v4 |
| HTTP Client | Axios |
| Routing | React Router DOM v7 |
| State Management | React Context API |
| Backend Framework | Node.js + Express 5 |
| Database | PostgreSQL (Neon) |
| ORM / Queries | pg (node-postgres) |
| Authentication | JWT + bcryptjs |
| AI / LLM | Google Gemini API |
| Security | Helmet, CORS |
| Logging | Morgan |

---

## Project Structure

```
AI-Powered-Restaurant-Management-System/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js                  # PostgreSQL connection pool
│   │   │   └── schema.sql             # Database schema + seed data
│   │   ├── controllers/
│   │   │   ├── authController.js      # Register, login, profile
│   │   │   ├── menuController.js      # Menu CRUD
│   │   │   ├── cartController.js      # Cart operations
│   │   │   ├── orderController.js     # Order placement + analytics
│   │   │   └── aiController.js        # AI chat + recommendations
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js      # JWT verification
│   │   │   ├── adminMiddleware.js     # Role-based access control
│   │   │   └── errorMiddleware.js     # Global error handler
│   │   ├── models/
│   │   │   ├── userModel.js           # User SQL queries
│   │   │   ├── menuModel.js           # Menu SQL queries
│   │   │   ├── orderModel.js          # Order SQL queries
│   │   │   └── cartModel.js           # Cart SQL queries
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── menuRoutes.js
│   │   │   ├── cartRoutes.js
│   │   │   ├── orderRoutes.js
│   │   │   └── aiRoutes.js
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   ├── menuService.js
│   │   │   ├── cartService.js
│   │   │   ├── orderService.js
│   │   │   └── aiService.js           # Gemini API integration
│   │   └── utils/
│   │       ├── generateToken.js       # JWT generation
│   │       └── apiError.js            # Custom error class
│   ├── .env                           # Environment variables (not committed)
│   ├── server.js                      # Express app entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx                   # React entry point
│   │   ├── App.jsx                    # Router + context providers
│   │   ├── index.css                  # Global styles + Tailwind
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Navbar.jsx         # Responsive navigation with cart badge
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── LoadingSpinner.jsx
│   │   │   │   ├── Toast.jsx          # Global toast notifications
│   │   │   │   └── ProtectedRoute.jsx # Auth + admin route guards
│   │   │   ├── menu/
│   │   │   │   └── MenuCard.jsx       # Menu item card with add-to-cart
│   │   │   └── ai/
│   │   │       └── Chatbot.jsx        # Floating AI chat widget
│   │   ├── context/
│   │   │   ├── AuthContext.jsx        # Global auth state
│   │   │   └── CartContext.jsx        # Global cart state
│   │   ├── pages/
│   │   │   ├── Home.jsx               # Landing page + AI recommendations
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Menu.jsx               # Menu with search and filters
│   │   │   ├── Cart.jsx               # Cart + order placement
│   │   │   ├── OrderHistory.jsx       # Order history + detail view
│   │   │   └── admin/
│   │   │       ├── Dashboard.jsx      # Analytics dashboard
│   │   │       ├── ManageMenu.jsx     # Menu CRUD
│   │   │       └── ManageOrders.jsx   # Order management
│   │   ├── services/
│   │   │   ├── api.js                 # Axios instance + interceptors
│   │   │   ├── authService.js
│   │   │   ├── menuService.js
│   │   │   ├── cartService.js
│   │   │   ├── orderService.js
│   │   │   └── aiService.js
│   │   └── utils/
│   │       └── formatCurrency.js
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm
- A PostgreSQL database (Neon free tier recommended)
- A Google Gemini API key (for AI features)

### Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Copy and fill in environment variables
# Edit .env with your DATABASE_URL, JWT_SECRET, GEMINI_API_KEY

# Run database schema (creates all tables + seed data)
node runSchema.js

# Start development server
npm run dev
```

The API will be available at `http://localhost:5000`.
Health check: `http://localhost:5000/api/health`

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`.

### Environment Variables

Create a `.env` file inside the `backend/` directory:

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment (`development` / `production`) | Yes |
| `PORT` | Server port (default: 5000) | No |
| `DATABASE_URL` | PostgreSQL connection string (Neon) | Yes |
| `JWT_SECRET` | Secret key for signing JWT tokens | Yes |
| `JWT_EXPIRES_IN` | Token expiry duration (default: `7d`) | No |
| `FRONTEND_URL` | Frontend origin for CORS (default: `http://localhost:5173`) | Yes |
| `GEMINI_API_KEY` | Google Gemini API key for AI features | Yes |

---

## Architecture

The backend follows a layered architecture:

- **Routes** — define URL paths and apply middleware guards
- **Controllers** — handle HTTP request/response, call services
- **Services** — contain all business logic
- **Models** — execute SQL queries against PostgreSQL
- **Middleware** — JWT auth, admin RBAC, global error handling

The frontend uses:

- **React Context** — global auth and cart state without prop drilling
- **Services layer** — all API calls centralized, never in components
- **Protected Routes** — customer and admin route guards

---

## API Endpoints

### Authentication

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Register a new customer account |
| POST | `/api/auth/login` | Login — returns JWT token |
| GET | `/api/auth/profile` | Get current user profile (protected) |
| PUT | `/api/auth/profile` | Update profile (protected) |
| GET | `/api/auth/users` | List all users (admin only) |

### Menu

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/menu` | List menu items (filterable by category, search) |
| GET | `/api/menu/featured` | Get featured menu items |
| GET | `/api/menu/categories` | List all categories |
| GET | `/api/menu/:id` | Get single menu item |
| POST | `/api/menu` | Create menu item (admin) |
| PUT | `/api/menu/:id` | Update menu item (admin) |
| DELETE | `/api/menu/:id` | Delete menu item (admin) |
| PATCH | `/api/menu/:id/toggle` | Toggle availability (admin) |

### Cart

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/cart` | Get current user's cart (protected) |
| POST | `/api/cart` | Add item to cart (protected) |
| PUT | `/api/cart/:itemId` | Update item quantity (protected) |
| DELETE | `/api/cart/:itemId` | Remove item from cart (protected) |
| DELETE | `/api/cart/clear` | Clear entire cart (protected) |

### Orders

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/orders` | Place a new order (protected) |
| GET | `/api/orders/my-orders` | Get current user's orders (protected) |
| GET | `/api/orders/:id` | Get order detail (protected) |
| GET | `/api/orders` | List all orders (admin) |
| PUT | `/api/orders/:id/status` | Update order status (admin) |
| GET | `/api/orders/analytics/summary` | Dashboard summary (admin) |
| GET | `/api/orders/analytics/revenue` | Revenue by date range (admin) |
| GET | `/api/orders/analytics/top-items` | Top selling items (admin) |

### AI

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/ai/chat` | Send message to AI chatbot |
| POST | `/api/ai/recommendations` | Get personalized food recommendations |

---

## Database Models

| Model | Description |
|-------|-------------|
| `users` | Customer and admin accounts with hashed passwords |
| `categories` | Menu item categories (Starters, Main Course, etc.) |
| `menu_items` | Dishes with price, image, dietary info, availability |
| `orders` | Customer orders with status and payment info |
| `order_items` | Individual items within an order (price snapshot) |
| `cart_items` | Persistent cart per user with UNIQUE constraint |

---

## AI Features

### AI Chatbot Assistant
Built on Google Gemini 1.5 Flash. The assistant understands the restaurant context — menu, hours, location — and responds conversationally to customer queries.

### AI Food Recommendations
Customers provide preferences (dietary requirement, mood, budget, spice level) and the AI analyzes the full menu to return 4–5 personalized dish suggestions with reasoning.

---

## Authentication

Admin and customer routes are protected with JWT Bearer tokens.

- `POST /api/auth/login` returns an access token on valid credentials
- Include the token in requests: `Authorization: Bearer <token>`
- Tokens are verified on every protected route via `authMiddleware`
- Admin-only routes additionally require `role === 'admin'` via `adminMiddleware`
- Passwords are hashed with bcrypt (12 salt rounds)

---

## Seeded Data

On first database setup the schema seeds:

- **Admin user:** `admin@restaurant.com` / `Admin@123`
- **6 categories:** Starters, Main Course, Breads, Rice & Biryani, Desserts, Beverages
- **15 menu items:** Authentic Indian dishes across all categories with images, pricing, and dietary flags

---

## Frontend Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Hero, featured dishes, AI recommendations UI |
| `/menu` | Menu | Full menu with search, category filters, pagination |
| `/login` | Login | JWT login with role-based redirect |
| `/register` | Register | New customer account |
| `/cart` | Cart | Cart items, quantity controls, order placement |
| `/orders` | Order History | Past orders with status badges |
| `/orders/:id` | Order Detail | Full order breakdown |
| `/admin` | Dashboard | Revenue, order stats, top items |
| `/admin/menu` | Manage Menu | CRUD menu items, toggle availability |
| `/admin/orders` | Manage Orders | Update order statuses, view details |

---

## Components

### Layout
- **Navbar** — Responsive navigation with cart item badge, mobile hamburger menu, and role-based links
- **Footer** — Brand info, quick links, contact details

### Common
- **Toast** — Global notification system (success, error, info)
- **LoadingSpinner** — Reusable loading indicator
- **ProtectedRoute** — Redirects unauthenticated users to login
- **AdminRoute** — Redirects non-admins away from admin pages

### AI
- **Chatbot** — Floating chat bubble that expands into a full conversation window with typing indicators and conversation history

---

## Services

### `src/services/api.js`
Centralised Axios instance with:
- Base URL from environment variable
- Request interceptor — automatically attaches JWT token to every request
- Response interceptor — handles 401 (token expired) by clearing storage and redirecting to login

All other service files (`authService`, `menuService`, `cartService`, `orderService`, `aiService`) import this instance.

---

## Running the Application

Run both servers simultaneously in two terminals:

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Access the app at `http://localhost:5173`

---

## Deployment

### Backend (Render)
1. Set all environment variables in Render dashboard
2. Set `DATABASE_URL` to your Neon PostgreSQL connection string
3. Set `NODE_ENV=production`
4. Build command: `npm install`
5. Start command: `node server.js`

### Frontend (Vercel)
1. Set `VITE_API_URL` to your Render backend URL
2. Build command: `npm run build`
3. Output directory: `dist`

### Database (Neon)
1. Create a free project at [neon.tech](https://neon.tech)
2. Run the schema file in the SQL editor
3. Copy the connection string to `DATABASE_URL`
