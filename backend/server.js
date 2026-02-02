import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'

dotenv.config()

import { testConnection } from './src/config/db.js'
import errorHandler, { notFound } from './src/middleware/errorMiddleware.js'
import authRoutes from './src/routes/authRoutes.js'
import menuRoutes from './src/routes/menuRoutes.js'
import orderRoutes from './src/routes/orderRoutes.js'
import cartRoutes from './src/routes/cartRoutes.js'
import aiRoutes from './src/routes/aiRoutes.js'

const app = express()
const PORT = process.env.PORT || 5000

app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/menu', menuRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/ai', aiRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '🍽️ AI Restaurant API is running', timestamp: new Date().toISOString() })
})

app.use(notFound)
app.use(errorHandler)

const startServer = async () => {
  await testConnection()
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
    console.log(`🏥 Health: http://localhost:${PORT}/api/health`)
  })
}

startServer()
