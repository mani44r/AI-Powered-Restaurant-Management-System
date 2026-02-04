import pool from '../config/db.js'

const menuModel = {
  // Get all menu items with category info
  findAll: async ({ category, search, page = 1, limit = 20, available = true }) => {
    let query = `
      SELECT m.*, c.name AS category_name
      FROM menu_items m
      LEFT JOIN categories c ON m.category_id = c.id
      WHERE 1=1
    `
    const params = []
    let idx = 1

    if (available) {
      query += ` AND m.is_available = TRUE`
    }
    if (category) {
      params.push(category)
      query += ` AND c.name ILIKE $${idx++}`
    }
    if (search) {
      params.push(`%${search}%`)
      query += ` AND (m.name ILIKE $${idx++} OR m.description ILIKE $${idx - 1})`
    }

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM menu_items m LEFT JOIN categories c ON m.category_id = c.id WHERE 1=1${available ? ' AND m.is_available = TRUE' : ''}${category ? ' AND c.name ILIKE $1' : ''}`,
      category ? [category] : []
    )

    const offset = (page - 1) * limit
    params.push(limit, offset)
    query += ` ORDER BY m.is_featured DESC, m.name ASC LIMIT $${idx++} OFFSET $${idx++}`

    const result = await pool.query(query, params)
    return {
      items: result.rows,
      total: parseInt(countResult.rows[0].count),
    }
  },

  // Get single item by ID
  findById: async (id) => {
    const result = await pool.query(
      `SELECT m.*, c.name AS category_name
       FROM menu_items m
       LEFT JOIN categories c ON m.category_id = c.id
       WHERE m.id = $1`,
      [id]
    )
    return result.rows[0]
  },

  // Get featured items
  findFeatured: async () => {
    const result = await pool.query(
      `SELECT m.*, c.name AS category_name
       FROM menu_items m
       LEFT JOIN categories c ON m.category_id = c.id
       WHERE m.is_featured = TRUE AND m.is_available = TRUE
       ORDER BY m.rating DESC LIMIT 6`
    )
    return result.rows
  },

  // Create menu item
  create: async ({ name, description, price, image_url, category_id, is_vegetarian, is_featured, preparation_time }) => {
    const result = await pool.query(
      `INSERT INTO menu_items (name, description, price, image_url, category_id, is_vegetarian, is_featured, preparation_time)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [name, description, price, image_url, category_id, is_vegetarian || false, is_featured || false, preparation_time || 15]
    )
    return result.rows[0]
  },

  // Update menu item
  update: async (id, fields) => {
    const { name, description, price, image_url, category_id, is_vegetarian, is_featured, is_available, preparation_time } = fields
    const result = await pool.query(
      `UPDATE menu_items
       SET name=$1, description=$2, price=$3, image_url=$4, category_id=$5,
           is_vegetarian=$6, is_featured=$7, is_available=$8, preparation_time=$9, updated_at=NOW()
       WHERE id=$10
       RETURNING *`,
      [name, description, price, image_url, category_id, is_vegetarian, is_featured, is_available, preparation_time, id]
    )
    return result.rows[0]
  },

  // Delete menu item
  delete: async (id) => {
    await pool.query('DELETE FROM menu_items WHERE id = $1', [id])
  },

  // Toggle availability
  toggleAvailability: async (id) => {
    const result = await pool.query(
      `UPDATE menu_items SET is_available = NOT is_available, updated_at = NOW()
       WHERE id = $1 RETURNING *`,
      [id]
    )
    return result.rows[0]
  },

  // Get all categories
  getCategories: async () => {
    const result = await pool.query('SELECT * FROM categories ORDER BY name')
    return result.rows
  },
}

export default menuModel
