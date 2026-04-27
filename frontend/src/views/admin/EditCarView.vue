<template>
  <div class="car-form-page">
    <div class="container">
      <div class="page-header">
        <button class="btn-back" @click="router.back()">← Back</button>
        <h1>Edit Car</h1>
      </div>

      <!-- Loading -->
      <div v-if="carStore.isLoading && !form.brand" class="loading">
        <p>Loading car details...</p>
      </div>

      <!-- Error -->
      <div v-if="carStore.error" class="error-box">
        <p>{{ carStore.error }}</p>
      </div>

      <!-- Form -->
      <form v-if="form.brand" @submit.prevent="handleSubmit" class="car-form">
        <div class="form-row">
          <div class="form-group">
            <label>Brand</label>
            <input v-model="form.brand" type="text" required />
          </div>
          <div class="form-group">
            <label>Name</label>
            <input v-model="form.name" type="text" required />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Category</label>
            <select v-model="form.category" required>
              <option value="sedan">Sedan</option>
              <option value="suv">SUV</option>
              <option value="coupe">Coupe</option>
              <option value="convertible">Convertible</option>
              <option value="sports">Sports</option>
              <option value="luxury">Luxury</option>
              <option value="electric">Electric</option>
            </select>
          </div>
          <div class="form-group">
            <label>Year</label>
            <input v-model="form.year" type="number" required />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Price Per Day ($)</label>
            <input v-model="form.price_per_day" type="number" step="0.01" required />
          </div>
          <div class="form-group">
            <label>Seats</label>
            <input v-model="form.seats" type="number" required />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Transmission</label>
            <select v-model="form.transmission" required>
              <option value="automatic">Automatic</option>
              <option value="manual">Manual</option>
            </select>
          </div>
          <div class="form-group">
            <label>Fuel Type</label>
            <select v-model="form.fuel_type" required>
              <option value="petrol">Petrol</option>
              <option value="diesel">Diesel</option>
              <option value="electric">Electric</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>Status</label>
          <select v-model="form.status" required>
            <option value="available">Available</option>
            <option value="booked">Booked</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>

        <div class="form-group">
          <label>Description</label>
          <textarea v-model="form.description" rows="4"></textarea>
        </div>

        <!-- Current Image -->
        <div class="form-group">
          <label>Current Image</label>
          <div v-if="currentImage" class="image-preview">
            <img :src="currentImage" alt="Current" />
          </div>
          <p v-else class="no-image">No image uploaded</p>
        </div>

        <!-- New Image -->
        <div class="form-group">
          <label>Change Image (Optional)</label>
          <input type="file" accept="image/*" @change="handleImageChange" />
          <div v-if="imagePreview" class="image-preview">
            <img :src="imagePreview" alt="New Preview" />
          </div>
        </div>

        <button type="submit" class="btn-submit" :disabled="carStore.isLoading">
          {{ carStore.isLoading ? 'Updating...' : 'Update Car' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCarStore } from '@/stores/car'

const route = useRoute()
const router = useRouter()
const carStore = useCarStore()

const imagePreview = ref(null)
const imageFile = ref(null)

const form = ref({
  brand: '',
  name: '',
  category: '',
  year: '',
  price_per_day: '',
  seats: '',
  transmission: '',
  fuel_type: '',
  status: '',
  description: '',
})

const currentImage = computed(() => {
  return carStore.selectedCar?.image ? `http://127.0.0.1:8000${carStore.selectedCar.image}` : null
})

function handleImageChange(event) {
  const file = event.target.files[0]
  if (file) {
    imageFile.value = file
    imagePreview.value = URL.createObjectURL(file)
  }
}

async function handleSubmit() {
  const formData = new FormData()

  Object.keys(form.value).forEach((key) => {
    formData.append(key, form.value[key])
  })

  if (imageFile.value) {
    formData.append('image', imageFile.value)
  }

  await carStore.updateCar(route.params.id, formData)
  if (!carStore.error) {
    router.push('/admin/dashboard')
  }
}

onMounted(async () => {
  await carStore.fetchCarById(route.params.id)
  if (carStore.selectedCar) {
    const car = carStore.selectedCar
    form.value = {
      brand: car.brand,
      name: car.name,
      category: car.category,
      year: car.year,
      price_per_day: car.price_per_day,
      seats: car.seats,
      transmission: car.transmission,
      fuel_type: car.fuel_type,
      status: car.status,
      description: car.description || '',
    }
  }
})
</script>

<style scoped>
.car-form-page {
  min-height: 100vh;
  padding: 40px 20px;
}

.container {
  max-width: 700px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 1.8rem;
  font-weight: 700;
}

.btn-back {
  background: none;
  border: 1px solid #ddd;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.btn-back:hover {
  background-color: #1a1a1a;
  color: white;
}

.error-box {
  background-color: #fff0f0;
  border: 1px solid #ffcccc;
  color: #cc0000;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.car-form {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
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

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #1a1a1a;
}

.image-preview {
  margin-top: 12px;
}

.image-preview img {
  width: 200px;
  height: 130px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.no-image {
  color: #999;
  font-size: 0.9rem;
  margin-top: 8px;
}

.btn-submit {
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

.btn-submit:hover {
  background-color: #333;
}

.btn-submit:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.loading {
  text-align: center;
  padding: 60px;
  color: #666;
}
</style>
