import pool from '../config/db.js'

const cartModel = {
  // Get cart items for a user
  findByUser: async (userId) => {
    const result = await pool.query(
      `SELECT ci.id, ci.quantity, ci.user_id,
        m.id AS menu_item_id, m.name, m.price, m.image_url, m.is_available, m.description,
        (m.price * ci.quantity) AS subtotal
       FROM cart_items ci
       JOIN menu_items m ON ci.menu_item_id = m.id
       WHERE ci.user_id = $1
       ORDER BY ci.created_at ASC`,
      [userId]
    )
    return result.rows
  },

  // Add or update item in cart (UPSERT)
  upsert: async (userId, menuItemId, quantity) => {
    const result = await pool.query(
      `INSERT INTO cart_items (user_id, menu_item_id, quantity)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, menu_item_id)
       DO UPDATE SET quantity = $3, updated_at = NOW()
       RETURNING *`,
      [userId, menuItemId, quantity]
    )
    return result.rows[0]
  },

  // Remove one item from cart
  removeItem: async (userId, menuItemId) => {
    await pool.query(
      'DELETE FROM cart_items WHERE user_id = $1 AND menu_item_id = $2',
      [userId, menuItemId]
    )
  },

  // Clear entire cart
  clearCart: async (userId) => {
    await pool.query('DELETE FROM cart_items WHERE user_id = $1', [userId])
  },

  // Get cart total
  getTotal: async (userId) => {
    const result = await pool.query(
      `SELECT COALESCE(SUM(m.price * ci.quantity), 0) AS total
       FROM cart_items ci
       JOIN menu_items m ON ci.menu_item_id = m.id
       WHERE ci.user_id = $1`,
      [userId]
    )
    return parseFloat(result.rows[0].total)
  },
}

export default cartModel
