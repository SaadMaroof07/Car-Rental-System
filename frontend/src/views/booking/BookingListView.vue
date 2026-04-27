<template>
  <div class="bookings-page">
    <div class="container">
      <h1>My Bookings</h1>

      <!-- Loading -->
      <div v-if="bookingStore.isLoading" class="loading">
        <p>Loading bookings...</p>
      </div>

      <!-- Error -->
      <div v-else-if="bookingStore.error" class="error">
        <p>{{ bookingStore.error }}</p>
      </div>

      <!-- No Bookings -->
      <div v-else-if="bookingStore.bookings.length === 0" class="empty">
        <p>No bookings yet!</p>
        <RouterLink to="/cars" class="btn-browse">Browse Cars</RouterLink>
      </div>

      <!-- Bookings List -->
      <div v-else class="bookings-list">
        <div v-for="booking in bookingStore.bookings" :key="booking.id" class="booking-card">
          <!-- Car Image -->
          <img
            :src="
              booking.car_detail?.image
                ? `http://127.0.0.1:8000${booking.car_detail.image}`
                : 'https://via.placeholder.com/200x130?text=No+Image'
            "
            :alt="booking.car_detail?.name"
          />

          <!-- Booking Info -->
          <div class="booking-info">
            <h3>{{ booking.car_detail?.brand }} {{ booking.car_detail?.name }}</h3>
            <div class="booking-dates">
              <span>📅 {{ booking.start_date }}</span>
              <span>→</span>
              <span>{{ booking.end_date }}</span>
            </div>
            <p class="booking-days">{{ booking.total_days }} days</p>
            <p class="booking-price">${{ booking.total_price }}</p>
          </div>

          <!-- Status + Action -->
          <div class="booking-actions">
            <span class="status-badge" :class="booking.status">
              {{ booking.status }}
            </span>
            <button
              v-if="booking.status === 'pending' || booking.status === 'confirmed'"
              class="btn-cancel"
              @click="handleCancel(booking.id)"
              :disabled="bookingStore.isLoading"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useBookingStore } from '@/stores/booking'

const bookingStore = useBookingStore()

async function handleCancel(id) {
  if (confirm('Are you sure you want to cancel this booking?')) {
    await bookingStore.cancelBooking(id)
  }
}

onMounted(() => {
  bookingStore.fetchMyBookings()
})
</script>

<style scoped>
.bookings-page {
  min-height: 100vh;
  padding: 40px 20px;
}

.container {
  max-width: 900px;
  margin: 0 auto;
}

h1 {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 30px;
}

.loading,
.error,
.empty {
  text-align: center;
  padding: 60px;
  color: #666;
}

.empty p {
  margin-bottom: 20px;
  font-size: 1.1rem;
}

.btn-browse {
  background-color: #1a1a1a;
  color: white;
  padding: 12px 25px;
  border-radius: 8px;
  font-weight: 600;
}

.bookings-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.booking-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  gap: 20px;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.booking-card img {
  width: 180px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
}

.booking-info {
  flex: 1;
}

.booking-info h3 {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.booking-dates {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #555;
  font-size: 0.9rem;
  margin-bottom: 5px;
}

.booking-days {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 5px;
}

.booking-price {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1a1a1a;
}

.booking-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.status-badge {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-badge.pending {
  background-color: #fff3cd;
  color: #856404;
}

.status-badge.confirmed {
  background-color: #d4edda;
  color: #155724;
}

.status-badge.cancelled {
  background-color: #f8d7da;
  color: #721c24;
}

.status-badge.completed {
  background-color: #d1ecf1;
  color: #0c5460;
}

.btn-cancel {
  background-color: #dc3545;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-cancel:hover {
  background-color: #c82333;
}

.btn-cancel:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
