import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Default Route
    {
      path: '/',
      redirect: '/cars',
    },

    // Auth Routes
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/auth/RegisterView.vue'),
      meta: { guestOnly: true },
    },

    {
      path: '/cars',
      name: 'cars',
      component: () => import('@/views/car/CarListView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/cars/:id',
      name: 'car-detail',
      component: () => import('@/views/car/CarDetailView.vue'),
      meta: { requiresAuth: true },
    },

    // Booking Routes
    {
      path: '/bookings',
      name: 'bookings',
      component: () => import('@/views/booking/BookingListView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/bookings/create/:id',
      name: 'create-booking',
      component: () => import('@/views/booking/CreateBookingView.vue'),
      meta: { requiresAuth: true },
    },

    // Admin Routes
    {
      path: '/admin/dashboard',
      name: 'admin-dashboard',
      component: () => import('@/views/admin/AdminDashboardView.vue'),
      meta: { requiresAuth: true, adminOnly: true },
    },

    {
      path: '/admin/cars/add',
      name: 'add-car',
      component: () => import('@/views/admin/AddCarView.vue'),
      meta: { requiresAuth: true, adminOnly: true },
    },
    {
      path: '/admin/cars/edit/:id',
      name: 'edit-car',
      component: () => import('@/views/admin/EditCarView.vue'),
      meta: { requiresAuth: true, adminOnly: true },
    },

    // 404
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
})

// Route Guard
router.beforeEach(async (to, from) => {
  const authStore = useAuthStore()

  // 1. Guest only pages — Agar user login hai to Login/Register par mat jane do
  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return '/cars' // <--- next() nikaal diya, sirf path return karein
  }

  // 2. Protected pages — Agar login nahi hai to login page bhejo
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return '/login' // <--- Seedha return
  }

  // 3. Admin only pages — Agar admin nahi hai to wapas cars par bhejo
  if (to.meta.adminOnly && !authStore.isAdmin) {
    return '/cars'
  }

  // Agar upar ki koi condition match nahi hui, to agle page par jane do
  return true
})

export default router
