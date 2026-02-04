import pool from '../config/db.js'

const userModel = {
  // Find user by email
  findByEmail: async (email) => {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )
    return result.rows[0]
  },

  // Find user by ID (without password)
  findById: async (id) => {
    const result = await pool.query(
      'SELECT id, name, email, role, phone, created_at FROM users WHERE id = $1',
      [id]
    )
    return result.rows[0]
  },

  // Create new user
  create: async ({ name, email, password, phone }) => {
    const result = await pool.query(
      `INSERT INTO users (name, email, password, phone) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, name, email, role, phone, created_at`,
      [name, email, password, phone || null]
    )
    return result.rows[0]
  },

  // Get all users (admin)
  findAll: async ({ page = 1, limit = 20 }) => {
    const offset = (page - 1) * limit
    const result = await pool.query(
      `SELECT id, name, email, role, phone, created_at 
       FROM users 
       ORDER BY created_at DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    )
    const count = await pool.query('SELECT COUNT(*) FROM users')
    return {
      users: result.rows,
      total: parseInt(count.rows[0].count),
    }
  },

  // Update user
  update: async (id, { name, phone }) => {
    const result = await pool.query(
      `UPDATE users SET name = $1, phone = $2, updated_at = NOW()
       WHERE id = $3
       RETURNING id, name, email, role, phone`,
      [name, phone, id]
    )
    return result.rows[0]
  },

  // Update password
  updatePassword: async (id, hashedPassword) => {
    await pool.query(
      'UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2',
      [hashedPassword, id]
    )
  },

  // Delete user
  delete: async (id) => {
    await pool.query('DELETE FROM users WHERE id = $1', [id])
  },

  // Check email exists
  emailExists: async (email) => {
    const result = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    )
    return result.rows.length > 0
  },
}

export default userModel
