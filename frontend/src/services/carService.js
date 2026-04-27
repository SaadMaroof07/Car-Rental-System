import api from './api'

const carService = {
  async getCars(params = {}) {
    const response = await api.get('/cars/', { params })
    return response.data
  },

  async getCarById(id) {
    const response = await api.get(`/cars/${id}/`)
    return response.data
  },

  async createCar(carData) {
    const response = await api.post('/cars/', carData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  async updateCar(id, carData) {
    const response = await api.put(`/cars/${id}/`, carData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  async deleteCar(id) {
    const response = await api.delete(`/cars/${id}/`)
    return response.data
  },
}

export default carService
