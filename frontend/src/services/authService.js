import api from './api'

const authService = {
  // Register
  async register(userData) {
    const response = await api.post('/users/', userData)
    return response.data
  },

  // Login
  async login(credentials) {
    const loginData = {
      username: credentials.email,
      password: credentials.password,
    }

    const response = await api.post('/users/login/', loginData)
    const { access, refresh } = response.data

    // 1. Tokens save karo
    localStorage.setItem('access_token', access)
    localStorage.setItem('refresh_token', refresh)

    // 2. --- YEH WALI LINE (ZAROORI) ---
    // Isse agla request (Profile) foran naye token ke sath jayega
    api.defaults.headers.common['Authorization'] = `Bearer ${access}`

    return response.data
  },

  // --- YE FUNCTIONS BHI FILE MEIN HONE CHAHIYEN ---
  async getProfile() {
    const response = await api.get('/users/profile/')
    return response.data
  },

  async logout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    // Logout par header saaf karo taake purana token na jaye
    delete api.defaults.headers.common['Authorization']
  },

  isAuthenticated() {
    return !!localStorage.getItem('access_token')
  },
}

export default authService
