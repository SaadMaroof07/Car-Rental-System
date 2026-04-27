import api from './api'

const bookingService = {
  async createBooking(bookingData) {
    const response = await api.post('/bookings/', bookingData)
    return response.data
  },

  async getMyBookings() {
    const response = await api.get('/bookings/')
    return response.data
  },

  async getBookingById(id) {
    const response = await api.get(`/bookings/${id}/`)
    return response.data
  },

  async cancelBooking(id) {
    const response = await api.post(`/bookings/${id}/cancel/`)
    return response.data
  },

  async updateBookingStatus(id, status) {
    const response = await api.post(`/bookings/${id}/update_status/`, { status })
    return response.data
  },

  async getStats() {
    const response = await api.get('/bookings/stats/')
    return response.data
  },
}

export default bookingService
