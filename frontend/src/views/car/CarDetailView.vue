<template>
  <div class="detail-page">
    <!-- Loading -->
    <div v-if="carStore.isLoading" class="loading">
      <p>Loading car details...</p>
    </div>

    <!-- Error -->
    <div v-else-if="carStore.error" class="error">
      <p>{{ carStore.error }}</p>
    </div>

    <!-- Car Detail -->
    <div v-else-if="carStore.selectedCar" class="detail-container">
      <!-- Back Button -->
      <button class="btn-back" @click="router.back()">← Back to Cars</button>

      <div class="detail-content">
        <!-- Left — Image -->
        <div class="detail-left">
          <img :src="carImage" :alt="carStore.selectedCar.name" />
          <span class="status-badge" :class="carStore.selectedCar.status">
            {{ carStore.selectedCar.status }}
          </span>
        </div>

        <!-- Right — Info -->
        <div class="detail-right">
          <h1>{{ carStore.selectedCar.brand }} {{ carStore.selectedCar.name }}</h1>
          <p class="category">
            {{ carStore.selectedCar.category }} • {{ carStore.selectedCar.year }}
          </p>

          <div class="specs">
            <div class="spec-item">
              <span class="spec-label">Seats</span>
              <span class="spec-value">🪑 {{ carStore.selectedCar.seats }}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Transmission</span>
              <span class="spec-value">⚙️ {{ carStore.selectedCar.transmission }}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Fuel Type</span>
              <span class="spec-value">⛽ {{ carStore.selectedCar.fuel_type }}</span>
            </div>
          </div>

          <p class="description">{{ carStore.selectedCar.description }}</p>

          <div class="booking-box">
            <p class="price">
              ${{ carStore.selectedCar.price_per_day }}
              <span>/day</span>
            </p>
            <button
              v-if="carStore.selectedCar.status === 'available'"
              class="btn-book"
              @click="goToBooking"
            >
              Book Now
            </button>
            <button v-else class="btn-unavailable" disabled>Not Available</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCarStore } from '@/stores/car'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const carStore = useCarStore()
const authStore = useAuthStore()

const carImage = computed(() => {
  return carStore.selectedCar?.image
    ? `http://127.0.0.1:8000${carStore.selectedCar.image}`
    : 'https://via.placeholder.com/600x400?text=No+Image'
})

function goToBooking() {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  router.push(`/bookings/create/${route.params.id}`)
}

onMounted(() => {
  carStore.fetchCarById(route.params.id)
})
</script>

<style scoped>
.detail-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 20px;
}

.btn-back {
  background: none;
  border: 1px solid #ddd;
  color: #333;
  padding: 8px 18px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 30px;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.btn-back:hover {
  background-color: #1a1a1a;
  color: white;
}

.detail-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.detail-left {
  position: relative;
}

.detail-left img {
  width: 100%;
  border-radius: 12px;
  object-fit: cover;
  height: 350px;
}

.status-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-badge.available {
  background-color: #d4edda;
  color: #155724;
}

.status-badge.booked {
  background-color: #f8d7da;
  color: #721c24;
}

.status-badge.maintenance {
  background-color: #fff3cd;
  color: #856404;
}

.detail-right h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.category {
  color: #666;
  text-transform: capitalize;
  margin-bottom: 25px;
}

.specs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 25px;
}

.spec-item {
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 10px;
  text-align: center;
}

.spec-label {
  display: block;
  font-size: 0.75rem;
  color: #666;
  margin-bottom: 5px;
}

.spec-value {
  font-size: 0.95rem;
  font-weight: 600;
  text-transform: capitalize;
}

.description {
  color: #555;
  line-height: 1.7;
  margin-bottom: 30px;
}

.booking-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 12px;
}

.price {
  font-size: 1.8rem;
  font-weight: 700;
}

.price span {
  font-size: 1rem;
  font-weight: 400;
  color: #666;
}

.btn-book {
  background-color: #1a1a1a;
  color: white;
  padding: 12px 30px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-book:hover {
  background-color: #333;
}

.btn-unavailable {
  background-color: #ccc;
  color: white;
  padding: 12px 30px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: not-allowed;
}

.loading,
.error {
  text-align: center;
  padding: 60px;
  color: #666;
}

.error {
  color: #cc0000;
}
</style>
