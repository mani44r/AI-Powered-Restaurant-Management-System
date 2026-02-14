import api from './api'

const menuService = {
  getAllItems: async (params = {}) => {
    const response = await api.get('/menu', { params })
    return response.data
  },
  getItemById: async (id) => {
    const response = await api.get(`/menu/${id}`)
    return response.data
  },
  getFeatured: async () => {
    const response = await api.get('/menu/featured')
    return response.data
  },
  getCategories: async () => {
    const response = await api.get('/menu/categories')
    return response.data
  },
  // Admin
  createItem: async (data) => {
    const response = await api.post('/menu', data)
    return response.data
  },
  updateItem: async (id, data) => {
    const response = await api.put(`/menu/${id}`, data)
    return response.data
  },
  deleteItem: async (id) => {
    const response = await api.delete(`/menu/${id}`)
    return response.data
  },
  toggleAvailability: async (id) => {
    const response = await api.patch(`/menu/${id}/toggle`)
    return response.data
  },
}

export default menuService
