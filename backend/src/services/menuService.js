import menuModel from '../models/menuModel.js'
import ApiError from '../utils/apiError.js'

const menuService = {
  getAllItems: async (query) => {
    return menuModel.findAll(query)
  },

  getItemById: async (id) => {
    const item = await menuModel.findById(id)
    if (!item) throw new ApiError(404, 'Menu item not found')
    return item
  },

  getFeaturedItems: async () => {
    return menuModel.findFeatured()
  },

  getCategories: async () => {
    return menuModel.getCategories()
  },

  createItem: async (data) => {
    if (!data.name || !data.price || !data.category_id) {
      throw new ApiError(400, 'Name, price, and category are required')
    }
    if (data.price <= 0) throw new ApiError(400, 'Price must be greater than 0')
    return menuModel.create(data)
  },

  updateItem: async (id, data) => {
    const item = await menuModel.findById(id)
    if (!item) throw new ApiError(404, 'Menu item not found')
    return menuModel.update(id, { ...item, ...data })
  },

  deleteItem: async (id) => {
    const item = await menuModel.findById(id)
    if (!item) throw new ApiError(404, 'Menu item not found')
    await menuModel.delete(id)
  },

  toggleAvailability: async (id) => {
    const item = await menuModel.findById(id)
    if (!item) throw new ApiError(404, 'Menu item not found')
    return menuModel.toggleAvailability(id)
  },
}

export default menuService
