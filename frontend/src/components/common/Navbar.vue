<template>
  <nav class="navbar">
    <div class="navbar-container">
      <!-- Logo -->
      <RouterLink to="/cars" class="navbar-logo"> 🚗 Car Rental </RouterLink>

      <!-- Links -->
      <div class="navbar-links">
        <RouterLink to="/cars">Cars</RouterLink>
        <RouterLink to="/bookings" v-if="authStore.isAuthenticated"> My Bookings </RouterLink>
      </div>

      <!-- Right Side -->
      <div class="navbar-right">
        <!-- Logged In -->
        <template v-if="authStore.isAuthenticated">
          <span class="user-email">{{ authStore.user?.email }}</span>
          <button class="btn-logout" @click="handleLogout">Logout</button>
        </template>

        <RouterLink to="/admin/dashboard" v-if="authStore.isAdmin"> Dashboard </RouterLink>

        <!-- Logged Out -->
        <template v-else>
          <RouterLink to="/login" class="btn-login">Login</RouterLink>
          <RouterLink to="/register" class="btn-register">Register</RouterLink>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.navbar {
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 65px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar-logo {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1a1a1a;
}

.navbar-links {
  display: flex;
  gap: 30px;
}

.navbar-links a {
  font-size: 0.95rem;
  font-weight: 500;
  color: #555;
  transition: color 0.2s;
}

.navbar-links a:hover,
.navbar-links a.router-link-active {
  color: #1a1a1a;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-email {
  font-size: 0.9rem;
  color: #555;
}

.btn-logout {
  background-color: #1a1a1a;
  color: white;
  padding: 8px 18px;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-logout:hover {
  background-color: #333;
}

.btn-login {
  color: #1a1a1a;
  font-size: 0.9rem;
  font-weight: 500;
}

.btn-register {
  background-color: #1a1a1a;
  color: white;
  padding: 8px 18px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.btn-register:hover {
  background-color: #333;
}
</style>
