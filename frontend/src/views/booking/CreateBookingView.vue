<template>
  <div class="booking-page">
    <div class="booking-container">
      <h1>Book This Car</h1>

      <!-- Car Info -->
      <div v-if="carStore.selectedCar" class="car-summary">
        <img
          :src="
            carStore.selectedCar.image
              ? `http://127.0.0.1:8000${carStore.selectedCar.image}`
              : 'https://via.placeholder.com/400x250?text=No+Image'
          "
          :alt="carStore.selectedCar.name"
        />
        <div class="car-summary-info">
          <h2>{{ carStore.selectedCar.brand }} {{ carStore.selectedCar.name }}</h2>
          <p>{{ carStore.selectedCar.year }} • {{ carStore.selectedCar.category }}</p>
          <p class="price">${{ carStore.selectedCar.price_per_day }}/day</p>
        </div>
      </div>

      <!-- Error -->
      <div v-if="bookingStore.error" class="error-box">
        <p>{{ bookingStore.error }}</p>
      </div>

      <!-- Booking Form -->
      <form @submit.prevent="handleBooking" class="booking-form">
        <div class="form-group">
          <label>Start Date</label>
          <input v-model="form.start_date" type="date" :min="today" required />
        </div>

        <div class="form-group">
          <label>End Date</label>
          <input v-model="form.end_date" type="date" :min="form.start_date || today" required />
        </div>

        <!-- Price Calculation -->
        <div v-if="totalDays > 0" class="price-summary">
          <div class="price-row">
            <span>${{ carStore.selectedCar?.price_per_day }} × {{ totalDays }} days</span>
            <span>${{ totalPrice }}</span>
          </div>
          <div class="price-row total">
            <span>Total</span>
            <span>${{ totalPrice }}</span>
          </div>
        </div>

        <button type="submit" class="btn-book" :disabled="bookingStore.isLoading || totalDays <= 0">
          {{ bookingStore.isLoading ? 'Booking...' : `Book Now — $${totalPrice}` }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCarStore } from '@/stores/car'
import { useBookingStore } from '@/stores/booking'

const route = useRoute()
const router = useRouter()
const carStore = useCarStore()
const bookingStore = useBookingStore()

const today = new Date().toISOString().split('T')[0]

const form = ref({
  start_date: '',
  end_date: '',
})

const totalDays = computed(() => {
  if (!form.value.start_date || !form.value.end_date) return 0
  const start = new Date(form.value.start_date)
  const end = new Date(form.value.end_date)
  const days = (end - start) / (1000 * 60 * 60 * 24)
  return days > 0 ? days : 0
})

const totalPrice = computed(() => {
  if (!carStore.selectedCar || totalDays.value <= 0) return 0
  return (carStore.selectedCar.price_per_day * totalDays.value).toFixed(2)
})

async function handleBooking() {
  const booking = await bookingStore.createBooking({
    car: route.params.id,
    start_date: form.value.start_date,
    end_date: form.value.end_date,
  })
  if (booking) {
    router.push('/bookings')
  }
}

onMounted(() => {
  carStore.fetchCarById(route.params.id)
})
</script>

<style scoped>
.booking-page {
  min-height: 100vh;
  padding: 40px 20px;
}

.booking-container {
  max-width: 600px;
  margin: 0 auto;
}

h1 {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 30px;
}

.car-summary {
  display: flex;
  gap: 20px;
  background: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.car-summary img {
  width: 150px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

.car-summary-info h2 {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 5px;
}

.car-summary-info p {
  color: #666;
  font-size: 0.9rem;
  text-transform: capitalize;
}

.price {
  color: #1a1a1a !important;
  font-weight: 700 !important;
  font-size: 1.1rem !important;
  margin-top: 8px;
}

.error-box {
  background-color: #fff0f0;
  border: 1px solid #ffcccc;
  color: #cc0000;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.booking-form {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  box-sizing: border-box;
}

.form-group input:focus {
  border-color: #1a1a1a;
}

.price-summary {
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.price-row {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  color: #555;
}

.price-row.total {
  border-top: 1px solid #ddd;
  margin-top: 8px;
  padding-top: 12px;
  font-weight: 700;
  color: #1a1a1a;
  font-size: 1.1rem;
}

.btn-book {
  width: 100%;
  padding: 14px;
  background-color: #1a1a1a;
  color: white;
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

.btn-book:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
