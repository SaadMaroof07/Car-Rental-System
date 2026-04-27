import { defineStore } from 'pinia'
import { ref } from 'vue'
import bookingService from '@/services/bookingService'
import { useToast } from 'vue-toastification'

export const useBookingStore = defineStore('booking', () => {
  const toast = useToast()

  // State
  const bookings = ref([])
  const selectedBooking = ref(null)
  const isLoading = ref(false)
  const error = ref(null)
  const stats = ref(null)

  // Actions
  async function createBooking(bookingData) {
    isLoading.value = true
    error.value = null
    try {
      const data = await bookingService.createBooking(bookingData)
      bookings.value.unshift(data)
      toast.success('Car booked successfully!')
      return data
    } catch (err) {
      error.value = err.response?.data || 'Failed to create booking.'
      toast.error('Failed to create booking.')
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function fetchMyBookings() {
    isLoading.value = true
    error.value = null
    try {
      const data = await bookingService.getMyBookings()
      bookings.value = data.results
    } catch (err) {
      error.value = 'Failed to load bookings.'
      toast.error('Failed to load bookings.')
    } finally {
      isLoading.value = false
    }
  }

  async function fetchBookingById(id) {
    isLoading.value = true
    error.value = null
    try {
      const data = await bookingService.getBookingById(id)
      selectedBooking.value = data
    } catch (err) {
      error.value = 'Failed to load booking.'
      toast.error('Failed to load booking.')
    } finally {
      isLoading.value = false
    }
  }

  async function cancelBooking(id) {
    isLoading.value = true
    error.value = null
    try {
      await bookingService.cancelBooking(id)
      // List mein status update karo
      const booking = bookings.value.find((b) => b.id === id)
      if (booking) booking.status = 'cancelled'
      toast.success('Booking cancelled successfully!')
    } catch (err) {
      error.value = err.response?.data || 'Failed to cancel booking.'
      toast.error('Failed to cancel booking.')
    } finally {
      isLoading.value = false
    }
  }

  async function updateBookingStatus(id, status) {
    isLoading.value = true
    error.value = null
    try {
      await bookingService.updateBookingStatus(id, status)
      const booking = bookings.value.find((b) => b.id === id)
      if (booking) booking.status = status
      toast.success(`Booking status updated to ${status}!`)
    } catch (err) {
      error.value = 'Failed to update status.'
      toast.error('Failed to update status.')
    } finally {
      isLoading.value = false
    }
  }

  async function fetchStats() {
    isLoading.value = true
    try {
      const data = await bookingService.getStats()
      stats.value = data
    } catch (err) {
      toast.error('Failed to load stats.')
    } finally {
      isLoading.value = false
    }
  }

  return {
    bookings,
    selectedBooking,
    isLoading,
    error,
    stats,
    createBooking,
    fetchMyBookings,
    fetchBookingById,
    cancelBooking,
    updateBookingStatus,
    fetchStats,
  }
})
