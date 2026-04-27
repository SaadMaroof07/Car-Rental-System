import { defineStore } from 'pinia'
import { ref } from 'vue'
import carService from '@/services/carService'
import { useToast } from 'vue-toastification'

export const useCarStore = defineStore('car', () => {
  const toast = useToast()

  // State
  const cars = ref([])
  const selectedCar = ref(null)
  const isLoading = ref(false)
  const error = ref(null)
  const totalCars = ref(0)
  const currentPage = ref(1)

  // Actions
  async function fetchCars(params = {}) {
    isLoading.value = true
    error.value = null
    try {
      const data = await carService.getCars(params)
      cars.value = data.results
      totalCars.value = data.count
    } catch (err) {
      error.value = 'Failed to load cars.'
      toast.error('Failed to load cars.')
    } finally {
      isLoading.value = false
    }
  }

  async function fetchCarById(id) {
    isLoading.value = true
    error.value = null
    selectedCar.value = null
    try {
      const data = await carService.getCarById(id)
      selectedCar.value = data
    } catch (err) {
      error.value = 'Failed to load car details.'
      toast.error('Failed to load car details.')
    } finally {
      isLoading.value = false
    }
  }

  async function createCar(carData) {
    isLoading.value = true
    error.value = null
    try {
      await carService.createCar(carData)
      toast.success('Car added successfully!')
      await fetchCars()
    } catch (err) {
      error.value = err.response?.data || 'Failed to add car.'
      toast.error('Failed to add car.')
    } finally {
      isLoading.value = false
    }
  }

  async function updateCar(id, carData) {
    isLoading.value = true
    error.value = null
    try {
      await carService.updateCar(id, carData)
      toast.success('Car updated successfully!')
      await fetchCars()
    } catch (err) {
      error.value = err.response?.data || 'Failed to update car.'
      toast.error('Failed to update car.')
    } finally {
      isLoading.value = false
    }
  }

  async function deleteCar(id) {
    isLoading.value = true
    error.value = null
    try {
      await carService.deleteCar(id)
      toast.success('Car deleted successfully!')
      await fetchCars()
    } catch (err) {
      error.value = 'Failed to delete car.'
      toast.error('Failed to delete car.')
    } finally {
      isLoading.value = false
    }
  }

  return {
    cars,
    selectedCar,
    isLoading,
    error,
    totalCars,
    currentPage,
    fetchCars,
    fetchCarById,
    createCar,
    updateCar,
    deleteCar,
  }
})
