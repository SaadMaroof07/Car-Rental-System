<template>
  <div class="login-page">
    <div class="login-card">
      <h1>Welcome Back 🚗</h1>
      <p class="subtitle">Login to your account</p>

      <!-- Error Message -->
      <div v-if="authStore.error" class="error-box">
        <p>{{ authStore.error }}</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Email</label>
          <input v-model="form.email" type="email" placeholder="Enter your email" required />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input
            v-model="form.password"
            type="password"
            placeholder="Enter your password"
            required
          />
        </div>

        <button type="submit" class="btn-login" :disabled="authStore.isLoading">
          {{ authStore.isLoading ? 'Logging in...' : 'Login' }}
        </button>
      </form>

      <p class="register-link">
        Don't have an account?
        <RouterLink to="/register">Register here</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  email: '',
  password: '',
})

async function handleLogin() {
  await authStore.login(form.value)
  if (authStore.isAuthenticated) {
    if (authStore.isAdmin) {
      router.push('/admin/dashboard')
    } else {
      router.push('/cars')
    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
}

.login-card {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 420px;
}

h1 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.subtitle {
  color: #666;
  margin-bottom: 30px;
}

.error-box {
  background-color: #fff0f0;
  border: 1px solid #ffcccc;
  color: #cc0000;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 0.9rem;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-group input:focus {
  border-color: #e50914;
}

.btn-login {
  width: 100%;
  padding: 13px;
  background-color: #1a1a1a;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-login:hover {
  background-color: #333;
}

.btn-login:disabled {
  background-color: #999;
  cursor: not-allowed;
}

.register-link {
  text-align: center;
  margin-top: 20px;
  color: #666;
  font-size: 0.9rem;
}

.register-link a {
  color: #1a1a1a;
  font-weight: 600;
  text-decoration: underline;
}
</style>
