<template>
  <div class="not-found">
    <h1>404</h1>
    <p>Page not found!</p>
    <RouterLink to="/cars">Go Back Home</RouterLink>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

h1 {
  font-size: 6rem;
  font-weight: 700;
  color: #1a1a1a;
}

p {
  font-size: 1.2rem;
  color: #666;
}

a {
  background-color: #1a1a1a;
  color: white;
  padding: 12px 30px;
  border-radius: 8px;
  font-weight: 600;
}
</style>
