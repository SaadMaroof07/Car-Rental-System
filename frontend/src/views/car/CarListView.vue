<template>
  <div class="cars-page">
    <!-- Header -->
    <div class="page-header">
      <h1>Available Cars</h1>
      <p>Find your perfect car</p>
    </div>

    <!-- Filters -->
    <div class="filters">
      <input v-model="searchQuery" type="text" placeholder="Search cars..." @input="handleSearch" />

      <select v-model="selectedCategory" @change="handleFilter">
        <option value="">All Categories</option>
        <option value="sedan">Sedan</option>
        <option value="suv">SUV</option>
        <option value="coupe">Coupe</option>
        <option value="convertible">Convertible</option>
        <option value="sports">Sports</option>
        <option value="luxury">Luxury</option>
        <option value="electric">Electric</option>
      </select>

      <select v-model="selectedStatus" @change="handleFilter">
        <option value="">All Status</option>
        <option value="available">Available</option>
        <option value="booked">Booked</option>
        <option value="maintenance">Maintenance</option>
      </select>

      <select v-model="selectedOrdering" @change="handleFilter">
        <option value="">Default</option>
        <option value="price_per_day">Price: Low to High</option>
        <option value="-price_per_day">Price: High to Low</option>
        <option value="year">Year: Old to New</option>
        <option value="-year">Year: New to Old</option>
      </select>
    </div>

    <!-- Loading -->
    <div v-if="carStore.isLoading" class="loading">
      <p>Loading cars...</p>
    </div>

    <!-- Error -->
    <div v-else-if="carStore.error" class="error">
      <p>{{ carStore.error }}</p>
    </div>

    <!-- Cars Grid -->
    <div v-else-if="carStore.cars.length > 0" class="cars-grid">
      <CarCard v-for="car in carStore.cars" :key="car.id" :car="car" />
    </div>

    <!-- No Cars -->
    <div v-else class="empty">
      <p>No cars found!</p>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="pagination">
      <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCarStore } from '@/stores/car'
import CarCard from '@/components/car/CarCard.vue'

const carStore = useCarStore()

const searchQuery = ref('')
const selectedCategory = ref('')
const selectedStatus = ref('')
const selectedOrdering = ref('')
const currentPage = ref(1)

const totalPages = computed(() => {
  return Math.ceil(carStore.totalCars / 10)
})

function getParams() {
  const params = {}
  if (searchQuery.value) params.search = searchQuery.value
  if (selectedCategory.value) params.category = selectedCategory.value
  if (selectedStatus.value) params.status = selectedStatus.value
  if (selectedOrdering.value) params.ordering = selectedOrdering.value
  params.page = currentPage.value
  return params
}

function handleSearch() {
  currentPage.value = 1
  carStore.fetchCars(getParams())
}

function handleFilter() {
  currentPage.value = 1
  carStore.fetchCars(getParams())
}

function changePage(page) {
  currentPage.value = page
  carStore.fetchCars(getParams())
  window.scrollTo(0, 0)
}

onMounted(() => {
  carStore.fetchCars()
})
</script>

<style scoped>
.cars-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.page-header {
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
}

.page-header p {
  color: #666;
  margin-top: 5px;
}

.filters {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.filters input,
.filters select {
  padding: 10px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.9rem;
  outline: none;
  background: white;
}

.filters input {
  flex: 1;
  min-width: 200px;
}

.cars-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
}

.loading,
.error,
.empty {
  text-align: center;
  padding: 60px;
  color: #666;
  font-size: 1.1rem;
}

.error {
  color: #cc0000;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-top: 40px;
}

.pagination button {
  padding: 10px 24px;
  background-color: #1a1a1a;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.pagination button:hover {
  background-color: #333;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination span {
  color: #666;
  font-size: 0.95rem;
}
</style>
