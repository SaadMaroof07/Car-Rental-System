<template>
  <div class="dashboard-page">
    <div class="container">
      <h1>Admin Dashboard</h1>

      <!-- Stats Cards -->
      <div v-if="bookingStore.stats" class="stats-grid">
        <div class="stat-card">
          <h3>Total Bookings</h3>
          <p class="stat-number">{{ bookingStore.stats.total_bookings }}</p>
        </div>
        <div class="stat-card pending">
          <h3>Pending</h3>
          <p class="stat-number">{{ bookingStore.stats.pending }}</p>
        </div>
        <div class="stat-card confirmed">
          <h3>Confirmed</h3>
          <p class="stat-number">{{ bookingStore.stats.confirmed }}</p>
        </div>
        <div class="stat-card completed">
          <h3>Completed</h3>
          <p class="stat-number">{{ bookingStore.stats.completed }}</p>
        </div>
        <div class="stat-card cancelled">
          <h3>Cancelled</h3>
          <p class="stat-number">{{ bookingStore.stats.cancelled }}</p>
        </div>
        <div class="stat-card revenue">
          <h3>Total Revenue</h3>
          <p class="stat-number">${{ bookingStore.stats.total_revenue }}</p>
        </div>
      </div>

      <!-- All Bookings -->
      <div class="bookings-section">
        <h2>All Bookings</h2>

        <!-- Loading -->
        <div v-if="bookingStore.isLoading" class="loading">
          <p>Loading...</p>
        </div>

        <!-- Bookings Table -->
        <div v-else-if="bookingStore.bookings.length > 0" class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Car</th>
                <th>Dates</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="booking in bookingStore.bookings" :key="booking.id">
                <td>#{{ booking.id }}</td>
                <td>{{ booking.user }}</td>
                <td>{{ booking.car_detail?.brand }} {{ booking.car_detail?.name }}</td>
                <td>{{ booking.start_date }} → {{ booking.end_date }}</td>
                <td>${{ booking.total_price }}</td>
                <td>
                  <span class="status-badge" :class="booking.status">
                    {{ booking.status }}
                  </span>
                </td>
                <td>
                  <select
                    v-if="booking.status !== 'cancelled' && booking.status !== 'completed'"
                    @change="handleStatusUpdate(booking.id, $event.target.value)"
                    :value="booking.status"
                    class="status-select"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <span v-else class="no-action">—</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty -->
        <div v-else class="empty">
          <p>No bookings yet!</p>
        </div>
      </div>

      <!-- Cars Management -->
      <div class="cars-section">
        <div class="section-header">
          <h2>Cars Management</h2>
          <RouterLink to="/admin/cars/add" class="btn-add"> + Add New Car </RouterLink>
        </div>

        <div v-if="carStore.cars.length > 0" class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Brand</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price/Day</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="car in carStore.cars" :key="car.id">
                <td>{{ car.brand }}</td>
                <td>{{ car.name }}</td>
                <td>{{ car.category }}</td>
                <td>${{ car.price_per_day }}</td>
                <td>
                  <span class="status-badge" :class="car.status">
                    {{ car.status }}
                  </span>
                </td>
                <td class="actions">
                  <RouterLink :to="`/admin/cars/edit/${car.id}`" class="btn-edit">
                    Edit
                  </RouterLink>
                  <button class="btn-delete" @click="handleDeleteCar(car.id)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useBookingStore } from '@/stores/booking'
import { useCarStore } from '@/stores/car'

const bookingStore = useBookingStore()
const carStore = useCarStore()

async function handleStatusUpdate(id, status) {
  await bookingStore.updateBookingStatus(id, status)
}

async function handleDeleteCar(id) {
  if (confirm('Are you sure you want to delete this car?')) {
    await carStore.deleteCar(id)
  }
}

onMounted(async () => {
  await bookingStore.fetchStats()
  await bookingStore.fetchMyBookings()
  await carStore.fetchCars()
})
</script>

<style scoped>
.dashboard-page {
  min-height: 100vh;
  padding: 40px 20px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 30px;
}

h2 {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 20px;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.stat-card h3 {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 10px;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
}

.stat-card.pending .stat-number {
  color: #856404;
}
.stat-card.confirmed .stat-number {
  color: #155724;
}
.stat-card.completed .stat-number {
  color: #0c5460;
}
.stat-card.cancelled .stat-number {
  color: #721c24;
}
.stat-card.revenue .stat-number {
  color: #1a1a1a;
}

/* Sections */
.bookings-section,
.cars-section {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  margin-bottom: 30px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.btn-add {
  background-color: #1a1a1a;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  transition: background-color 0.2s;
}

.btn-add:hover {
  background-color: #333;
}

/* Table */
.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background-color: #f5f5f5;
}

th {
  padding: 12px 16px;
  text-align: left;
  font-size: 0.85rem;
  color: #666;
  font-weight: 600;
}

td {
  padding: 14px 16px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 0.9rem;
  color: #333;
}

/* Status Badge */
.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.78rem;
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

/* Status Select */
.status-select {
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.85rem;
  outline: none;
  cursor: pointer;
}

/* Actions */
.actions {
  display: flex;
  gap: 8px;
}

.btn-edit {
  background-color: #1a1a1a;
  color: white;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
}

.btn-delete {
  background-color: #dc3545;
  color: white;
  padding: 6px 14px;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-delete:hover {
  background-color: #c82333;
}

.loading,
.empty {
  text-align: center;
  padding: 40px;
  color: #666;
}

.no-action {
  color: #ccc;
}
</style>
