<template>
  <div class="register-page">
    <div class="register-card">
      <h1>Create Account 🚗</h1>
      <p class="subtitle">Join us and start booking cars</p>

      <!-- Error Message -->
      <div v-if="authStore.error" class="error-box">
        <p>{{ authStore.error }}</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label>Email</label>
          <input v-model="form.email" type="email" placeholder="Enter your email" required />
        </div>

        <div class="form-group">
          <label>Username</label>
          <input v-model="form.username" type="text" placeholder="Enter your username" required />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>First Name</label>
            <input v-model="form.first_name" type="text" placeholder="First name" />
          </div>
          <div class="form-group">
            <label>Last Name</label>
            <input v-model="form.last_name" type="text" placeholder="Last name" />
          </div>
        </div>

        <div class="form-group">
          <label>Phone</label>
          <input v-model="form.phone" type="text" placeholder="Enter your phone number" />
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

        <div class="form-group">
          <label>Confirm Password</label>
          <input
            v-model="form.password_confirm"
            type="password"
            placeholder="Confirm your password"
            required
          />
        </div>

        <button type="submit" class="btn-register" :disabled="authStore.isLoading">
          {{ authStore.isLoading ? 'Creating Account...' : 'Create Account' }}
        </button>
      </form>

      <p class="login-link">
        Already have an account?
        <RouterLink to="/login">Login here</RouterLink>
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
  username: '',
  first_name: '',
  last_name: '',
  phone: '',
  password: '',
  password_confirm: '',
})

async function handleRegister() {
  await authStore.register(form.value)
  if (!authStore.error) {
    router.push('/login')
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  padding: 20px;
}

.register-card {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 480px;
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

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
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
  border-color: #1a1a1a;
}

.btn-register {
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

.btn-register:hover {
  background-color: #333;
}

.btn-register:disabled {
  background-color: #999;
  cursor: not-allowed;
}

.login-link {
  text-align: center;
  margin-top: 20px;
  color: #666;
  font-size: 0.9rem;
}

.login-link a {
  color: #1a1a1a;
  font-weight: 600;
  text-decoration: underline;
}
</style>
