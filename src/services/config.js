/**
 * API Configuration
 * Centralized configuration for backend connection
 */

const API_CONFIG = {
  // Base URL from environment or default
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api',

  // Timeout for requests (ms)
  timeout: parseInt(import.meta.env.VITE_REQUEST_TIMEOUT || '30000'),

  // Retry configuration
  retry: {
    attempts: parseInt(import.meta.env.VITE_API_RETRY_ATTEMPTS || '3'),
    delay: parseInt(import.meta.env.VITE_API_RETRY_DELAY || '1000'),
  },

  // API Endpoints mapping
  endpoints: {
    // Products
    products: {
      getAll: '/products',
      getById: (id) => `/products/${id}`,
      getByCategory: (category) => `/products/category/${category}`,
      search: (query) => `/products/search?q=${query}`,
      featured: '/products/featured',
    },

    // Authentication
    auth: {
      verify: '/auth/verify',
      login: '/auth/login',
      register: '/auth/register',
    },

    // Users
    users: {
      get: (firebaseUid) => `/users/${firebaseUid}`,
      update: (firebaseUid) => `/users/${firebaseUid}`,
      preferences: (firebaseUid) => `/users/${firebaseUid}/preferences`,
      addresses: (firebaseUid) => `/users/${firebaseUid}/addresses`,
    },

    // Basket/Cart
    basket: {
      get: (firebaseUid) => `/basket/user/${firebaseUid}`,
      add: '/basket/add',
      remove: (firebaseUid, productId) => `/basket/user/${firebaseUid}/item/${productId}`,
      update: (firebaseUid, productId) => `/basket/user/${firebaseUid}/item/${productId}`,
      clear: (firebaseUid) => `/basket/user/${firebaseUid}`,
    },

    // Subscriptions
    subscriptions: {
      getAll: (firebaseUid) => `/subscriptions/user/${firebaseUid}`,
      create: '/subscriptions',
      getById: (id) => `/subscriptions/${id}`,
      update: (id) => `/subscriptions/${id}`,
      cancel: (id) => `/subscriptions/${id}`,
      pause: (id) => `/subscriptions/${id}/pause`,
      resume: (id) => `/subscriptions/${id}/resume`,
    },

    // Orders
    orders: {
      create: '/orders/create',
      getAll: (firebaseUid) => `/orders/user/${firebaseUid}`,
      getById: (id) => `/orders/${id}`,
      cancel: (id) => `/orders/${id}/cancel`,
      history: (firebaseUid) => `/orders/history/${firebaseUid}`,
    },

    // Recommendations
    recommendations: {
      getForUser: (firebaseUid) => `/recommendations/user/${firebaseUid}`,
      getForProduct: (productId) => `/recommendations/product/${productId}`,
      personalized: '/recommendations/personalized',
    },

    // Wishlist
    wishlist: {
      get: (firebaseUid) => `/wishlist/user/${firebaseUid}`,
      add: (firebaseUid, productId) => `/wishlist/user/${firebaseUid}/product/${productId}`,
      remove: (firebaseUid, productId) => `/wishlist/user/${firebaseUid}/product/${productId}`,
    },

    // Payments
    payments: {
      process: '/payments',
      status: (paymentId) => `/payments/${paymentId}/status`,
      refund: (paymentId) => `/payments/${paymentId}/refund`,
    },
  },

  // Request headers
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },

  // CORS settings
  cors: 'include',
};

export default API_CONFIG;
