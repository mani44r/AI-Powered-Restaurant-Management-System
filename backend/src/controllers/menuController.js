import menuService from '../services/menuService.js'

const menuController = {
  getAll: async (req, res, next) => {
    try {
      const { category, search, page = 1, limit = 20 } = req.query
      const data = await menuService.getAllItems({
        category, search,
        page: parseInt(page),
        limit: parseInt(limit),
        available: req.user?.role !== 'admin',
      })
      res.json({ status: 'success', data })
    } catch (err) { next(err) }
  },

  getById: async (req, res, next) => {
    try {
      const item = await menuService.getItemById(parseInt(req.params.id))
      res.json({ status: 'success', data: { item } })
    } catch (err) { next(err) }
  },

  getFeatured: async (req, res, next) => {
    try {
      const items = await menuService.getFeaturedItems()
      res.json({ status: 'success', data: { items } })
    } catch (err) { next(err) }
  },

  getCategories: async (req, res, next) => {
    try {
      const categories = await menuService.getCategories()
      res.json({ status: 'success', data: { categories } })
    } catch (err) { next(err) }
  },

  create: async (req, res, next) => {
    try {
      const item = await menuService.createItem(req.body)
      res.status(201).json({ status: 'success', message: 'Menu item created', data: { item } })
    } catch (err) { next(err) }
  },

  update: async (req, res, next) => {
    try {
      const item = await menuService.updateItem(parseInt(req.params.id), req.body)
      res.json({ status: 'success', message: 'Menu item updated', data: { item } })
    } catch (err) { next(err) }
  },

  delete: async (req, res, next) => {
    try {
      await menuService.deleteItem(parseInt(req.params.id))
      res.json({ status: 'success', message: 'Menu item deleted' })
    } catch (err) { next(err) }
  },

  toggleAvailability: async (req, res, next) => {
    try {
      const item = await menuService.toggleAvailability(parseInt(req.params.id))
      res.json({ status: 'success', data: { item } })
    } catch (err) { next(err) }
  },
}

export default menuController
