/*
  WHY THIS FILE EXISTS:
  This file creates and exports the PostgreSQL database connection.

  RESPONSIBILITY:
  - Creates a connection "pool" to PostgreSQL
  - Tests the connection on startup
  - Exports the pool so any model file can query the database

  WHAT IS A CONNECTION POOL?
  Opening a new database connection for every request is slow and expensive.
  A pool maintains multiple open connections and reuses them.
  Think of it like a pool of taxis always ready to go, vs calling a new taxi 
  from scratch each time.

  HOW IT COMMUNICATES:
  - Imported by every file in models/ that needs to run SQL queries
  - server.js calls testConnection() on startup to verify DB is reachable

  INTERVIEW QUESTION:
  Q: Why use a connection pool instead of a single connection?
  A: A single connection handles one query at a time. Under load, 
     requests would queue up. A pool (default: 10 connections) handles 
     10 simultaneous queries. This is critical for performance.

  Q: What is the difference between pg.Client and pg.Pool?
  A: Client is a single connection — you manage connect/disconnect manually.
     Pool manages multiple connections automatically. Always use Pool in 
     production web servers.
*/

import pkg from 'pg'
const { Pool } = pkg
import dotenv from 'dotenv'

dotenv.config()

// Create the connection pool using the DATABASE_URL from .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }  // Required for Neon PostgreSQL on Render
    : false,                          // No SSL needed for local development
  max: 10,                            // Maximum number of connections in pool
  idleTimeoutMillis: 30000,           // Close idle connections after 30 seconds
  connectionTimeoutMillis: 2000,      // Fail fast if can't connect in 2 seconds
})

// Test the connection — called from server.js on startup
export const testConnection = async () => {
  try {
    const client = await pool.connect()
    console.log('✅ PostgreSQL connected successfully')
    client.release() // Return connection back to pool
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error.message)
    process.exit(1) // Stop the server if DB is unreachable
  }
}

// Export the pool — this is what model files use to run queries
export default pool
