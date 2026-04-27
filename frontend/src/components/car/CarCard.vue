<template>
  <div class="car-card">
    <!-- Car Image -->
    <div class="car-image">
      <img :src="carImage" :alt="car.name" />
      <span class="status-badge" :class="car.status">
        {{ car.status }}
      </span>
    </div>

    <!-- Car Info -->
    <div class="car-info">
      <h3>{{ car.brand }} {{ car.name }}</h3>
      <p class="year">{{ car.year }} • {{ car.category }}</p>

      <div class="car-details">
        <span>🪑 {{ car.seats }} Seats</span>
        <span>⚙️ {{ car.transmission }}</span>
        <span>⛽ {{ car.fuel_type }}</span>
      </div>

      <div class="car-footer">
        <p class="price">
          ${{ car.price_per_day }}
          <span>/day</span>
        </p>
        <button class="btn-detail" @click="goToDetail">View Details</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  car: {
    type: Object,
    required: true,
  },
})

const router = useRouter()

const carImage = computed(() => {
  return props.car.image
    ? `http://127.0.0.1:8000${props.car.image}`
    : 'https://via.placeholder.com/400x250?text=No+Image'
})

function goToDetail() {
  router.push(`/cars/${props.car.id}`)
}
</script>

<style scoped>
.car-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.car-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.car-image {
  position: relative;
}

.car-image img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.status-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
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

.car-info {
  padding: 16px;
}

.car-info h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.year {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 12px;
  text-transform: capitalize;
}

.car-details {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.car-details span {
  font-size: 0.8rem;
  color: #555;
  background-color: #f5f5f5;
  padding: 4px 10px;
  border-radius: 20px;
}

.car-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.price {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1a1a1a;
}

.price span {
  font-size: 0.85rem;
  font-weight: 400;
  color: #666;
}

.btn-detail {
  background-color: #1a1a1a;
  color: white;
  padding: 8px 18px;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-detail:hover {
  background-color: #333;
}
</style>
