<template>
  <div id="app">
    <Navbar />
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import Navbar from '@/components/common/Navbar.vue'

const authStore = useAuthStore()

onMounted(async () => {
  if (authStore.isAuthenticated) {
    await authStore.getProfile()
  }
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', sans-serif;
  background-color: #f5f5f5;
  color: #1a1a1a;
}

a {
  text-decoration: none;
  color: inherit;
}
</style>
