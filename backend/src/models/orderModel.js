import pool from '../config/db.js'

const orderModel = {
  // Create a new order
  create: async ({ user_id, total_amount, delivery_address, special_instructions, payment_method }) => {
    const result = await pool.query(
      `INSERT INTO orders (user_id, total_amount, delivery_address, special_instructions, payment_method)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [user_id, total_amount, delivery_address, special_instructions, payment_method || 'cash']
    )
    return result.rows[0]
  },

  // Add items to an order
  addItems: async (orderId, items) => {
    const values = items.map(item =>
      `(${orderId}, ${item.menu_item_id}, ${item.quantity}, ${item.unit_price}, ${item.subtotal})`
    ).join(', ')

    await pool.query(
      `INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, subtotal) VALUES ${values}`
    )
  },

  // Get order by ID with items
  findById: async (id) => {
    const orderResult = await pool.query(
      `SELECT o.*, u.name AS customer_name, u.email AS customer_email, u.phone AS customer_phone
       FROM orders o
       JOIN users u ON o.user_id = u.id
       WHERE o.id = $1`,
      [id]
    )
    if (!orderResult.rows[0]) return null

    const itemsResult = await pool.query(
      `SELECT oi.*, m.name AS item_name, m.image_url
       FROM order_items oi
       JOIN menu_items m ON oi.menu_item_id = m.id
       WHERE oi.order_id = $1`,
      [id]
    )

    return { ...orderResult.rows[0], items: itemsResult.rows }
  },

  // Get all orders for a specific user
  findByUser: async (userId, { page = 1, limit = 10 }) => {
    const offset = (page - 1) * limit
    const result = await pool.query(
      `SELECT o.*, 
        (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) AS item_count
       FROM orders o
       WHERE o.user_id = $1
       ORDER BY o.created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    )
    const count = await pool.query('SELECT COUNT(*) FROM orders WHERE user_id = $1', [userId])
    return { orders: result.rows, total: parseInt(count.rows[0].count) }
  },

  // Get all orders (admin)
  findAll: async ({ page = 1, limit = 20, status }) => {
    const offset = (page - 1) * limit
    let query = `
      SELECT o.*, u.name AS customer_name, u.email AS customer_email,
        (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) AS item_count
      FROM orders o
      JOIN users u ON o.user_id = u.id
    `
    const params = []
    if (status) {
      query += ` WHERE o.status = $1`
      params.push(status)
    }
    query += ` ORDER BY o.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
    params.push(limit, offset)

    const result = await pool.query(query, params)
    const countQ = status
      ? await pool.query('SELECT COUNT(*) FROM orders WHERE status = $1', [status])
      : await pool.query('SELECT COUNT(*) FROM orders')

    return { orders: result.rows, total: parseInt(countQ.rows[0].count) }
  },

  // Update order status
  updateStatus: async (id, status) => {
    const result = await pool.query(
      `UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [status, id]
    )
    return result.rows[0]
  },

  // Update payment status
  updatePaymentStatus: async (id, paymentStatus) => {
    const result = await pool.query(
      `UPDATE orders SET payment_status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [paymentStatus, id]
    )
    return result.rows[0]
  },

  // Analytics: revenue by date range
  getRevenue: async (startDate, endDate) => {
    const result = await pool.query(
      `SELECT 
        DATE(created_at) AS date,
        SUM(total_amount) AS revenue,
        COUNT(*) AS order_count
       FROM orders
       WHERE status != 'cancelled'
         AND payment_status = 'paid'
         AND created_at BETWEEN $1 AND $2
       GROUP BY DATE(created_at)
       ORDER BY date`,
      [startDate, endDate]
    )
    return result.rows
  },

  // Analytics: top selling items
  getTopItems: async (limit = 5) => {
    const result = await pool.query(
      `SELECT 
        m.name, 
        SUM(oi.quantity) AS total_sold,
        SUM(oi.subtotal) AS total_revenue
       FROM order_items oi
       JOIN menu_items m ON oi.menu_item_id = m.id
       JOIN orders o ON oi.order_id = o.id
       WHERE o.status != 'cancelled'
       GROUP BY m.id, m.name
       ORDER BY total_sold DESC
       LIMIT $1`,
      [limit]
    )
    return result.rows
  },

  // Analytics: dashboard summary
  getSummary: async () => {
    const today = new Date().toISOString().split('T')[0]
    const [orders, revenue, customers, todayOrders] = await Promise.all([
      pool.query(`SELECT COUNT(*) FROM orders WHERE status != 'cancelled'`),
      pool.query(`SELECT COALESCE(SUM(total_amount), 0) AS total FROM orders WHERE payment_status = 'paid'`),
      pool.query(`SELECT COUNT(*) FROM users WHERE role = 'customer'`),
      pool.query(`SELECT COUNT(*) FROM orders WHERE DATE(created_at) = $1`, [today]),
    ])
    return {
      totalOrders: parseInt(orders.rows[0].count),
      totalRevenue: parseFloat(revenue.rows[0].total),
      totalCustomers: parseInt(customers.rows[0].count),
      todayOrders: parseInt(todayOrders.rows[0].count),
    }
  },
}

export default orderModel
