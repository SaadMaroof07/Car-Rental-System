import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService from '@/services/authService'
import { useToast } from 'vue-toastification'

export const useAuthStore = defineStore('auth', () => {
  const toast = useToast()

  // State
  const user = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isCustomer = computed(() => user.value?.role === 'customer')

  // Actions
  async function register(userData) {
    isLoading.value = true
    error.value = null
    try {
      await authService.register(userData)
      toast.success('Account created successfully! Please login.')
    } catch (err) {
      error.value = err.response?.data || 'Registration failed.'
      toast.error('Registration failed. Please try again.')
    } finally {
      isLoading.value = false
    }
  }

  async function login(credentials) {
    isLoading.value = true
    error.value = null
    try {
      await authService.login(credentials)
      await getProfile()
      toast.success('Welcome back!')
    } catch (err) {
      error.value = err.response?.data || 'Login failed.'
      toast.error('Invalid email or password.')
    } finally {
      isLoading.value = false
    }
  }

  async function getProfile() {
    isLoading.value = true
    try {
      const data = await authService.getProfile()
      user.value = data
    } catch (err) {
      error.value = err.response?.data || 'Failed to get profile.'
    } finally {
      isLoading.value = false
    }
  }

  async function updateProfile(userData) {
    isLoading.value = true
    error.value = null
    try {
      const data = await authService.updateProfile(userData)
      user.value = data
      toast.success('Profile updated successfully!')
    } catch (err) {
      error.value = err.response?.data || 'Update failed.'
      toast.error('Failed to update profile.')
    } finally {
      isLoading.value = false
    }
  }

  function logout() {
    authService.logout()
    user.value = null
    toast.success('Logged out successfully!')
  }

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    isAdmin,
    isCustomer,
    register,
    login,
    getProfile,
    updateProfile,
    logout,
  }
})
