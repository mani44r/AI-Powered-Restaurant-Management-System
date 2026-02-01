# 🍽️ AI-Powered Restaurant Management System

Full-stack restaurant management system with AI features built with React, Node.js, PostgreSQL and Gemini AI.

## Tech Stack
- **Frontend:** React 19 + Vite + Tailwind CSS v4
- **Backend:** Node.js + Express 5
- **Database:** PostgreSQL (Neon for production)
- **Auth:** JWT + bcryptjs
- **AI:** Google Gemini API

---

## Setup Instructions

### 1. Database Setup (Neon PostgreSQL)

1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project → copy the connection string
3. Open the SQL editor and paste + run the contents of `backend/src/config/schema.sql`

### 2. Backend Setup

```bash
cd backend
# Edit .env file:
# DATABASE_URL=your_neon_connection_string
# JWT_SECRET=any_random_long_string
# GEMINI_API_KEY=your_gemini_api_key  (from aistudio.google.com)

npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm run dev
```

### 4. Access the app

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api/health

---

## Default Admin Login

- Email: `admin@restaurant.com`
- Password: `Admin@123`

---

## Features

### Customer
- Register / Login
- Browse & search menu with category filters
- Add to cart, update quantities
- Place orders with delivery address
- View order history & status
- AI food recommendations
- AI chatbot assistant

### Admin
- Dashboard with sales stats
- Manage menu items (CRUD + toggle availability)
- Manage & update order statuses
- View top selling items

---

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/       # DB connection + schema
│   │   ├── controllers/  # Request handlers
│   │   ├── middleware/   # Auth, admin, error handling
│   │   ├── models/       # SQL queries
│   │   ├── routes/       # API route definitions
│   │   ├── services/     # Business logic
│   │   └── utils/        # JWT, ApiError helpers
│   └── server.js
├── frontend/
│   └── src/
│       ├── components/   # Reusable UI (Navbar, MenuCard, Chatbot)
│       ├── context/      # AuthContext, CartContext
│       ├── pages/        # Home, Menu, Cart, Orders, Admin pages
│       ├── services/     # API call functions
│       └── utils/        # formatCurrency, formatDate
```
