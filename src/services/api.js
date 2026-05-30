import apiClient from './apiClient';

/**
 * Product API endpoints
 */
export const productAPI = {
  /**
   * Get all products (public)
   */
  getAll: () => apiClient.get('/products'),

  /**
   * Get product by ID
   * @param {number|string} id - Product ID
   */
  getById: (id) => apiClient.get(`/products/${id}`),

  /**
   * Get products by category
   * @param {string} category - Category name
   */
  getByCategory: (category) => apiClient.get(`/products/category/${category}`),

  /**
   * Search products
   * @param {string} query - Search query
   */
  search: (query) => apiClient.get(`/products/search?q=${encodeURIComponent(query)}`),

  /**
   * Get featured/trending products
   */
  getFeatured: () => apiClient.get('/products/featured'),

  /**
   * Get products with filters
   * @param {object} filters - { category, minPrice, maxPrice, rating, etc }
   */
  getFiltered: (filters) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value);
      }
    });
    return apiClient.get(`/products?${params.toString()}`);
  },
};

/**
 * Recommendation API endpoints
 */
export const recommendationAPI = {
  /**
   * Get recommendations for user
   * @param {string} firebaseUid - User's Firebase UID
   */
  getForUser: (firebaseUid) => 
    apiClient.get(`/recommendations/user/${firebaseUid}`),

  /**
   * Get recommendations for product
   * @param {number|string} productId - Product ID
   */
  getForProduct: (productId) => 
    apiClient.get(`/recommendations/product/${productId}`),

  /**
   * Get personalized recommendations
   * @param {object} options - { limit, category, etc }
   */
  getPersonalized: (options = {}) => {
    const params = new URLSearchParams(options);
    return apiClient.get(`/recommendations/personalized?${params.toString()}`);
  },
};

/**
 * Basket/Cart API endpoints
 */
export const basketAPI = {
  /**
   * Get user's basket
   * @param {string} firebaseUid - User's Firebase UID
   */
  get: (firebaseUid) => apiClient.get(`/basket/user/${firebaseUid}`),

  /**
   * Add item to basket
   * @param {string} firebaseUid - User's Firebase UID
   * @param {number|string} productId - Product ID
   * @param {number} quantity - Quantity to add
   */
  addItem: (firebaseUid, productId, quantity = 1) => 
    apiClient.post(`/basket/add`, {
      firebaseUid,
      productId,
      quantity,
    }),

  /**
   * Remove item from basket
   * @param {string} firebaseUid - User's Firebase UID
   * @param {number|string} productId - Product ID
   */
  removeItem: (firebaseUid, productId) =>
    apiClient.delete(`/basket/user/${firebaseUid}/item/${productId}`),

  /**
   * Update item quantity
   * @param {string} firebaseUid - User's Firebase UID
   * @param {number|string} productId - Product ID
   * @param {number} quantity - New quantity
   */
  updateQuantity: (firebaseUid, productId, quantity) =>
    apiClient.put(`/basket/user/${firebaseUid}/item/${productId}`, {
      quantity,
    }),

  /**
   * Clear entire basket
   * @param {string} firebaseUid - User's Firebase UID
   */
  clear: (firebaseUid) =>
    apiClient.delete(`/basket/user/${firebaseUid}`),
};

/**
 * Subscription API endpoints
 */
export const subscriptionAPI = {
  /**
   * Get user's active subscriptions
   * @param {string} firebaseUid - User's Firebase UID
   */
  getUserSubscriptions: (firebaseUid) => 
    apiClient.get(`/subscriptions/user/${firebaseUid}`),

  /**
   * Create new subscription
   * @param {object} data - Subscription data
   */
  create: (data) => 
    apiClient.post('/subscriptions', data),

  /**
   * Get subscription details
   * @param {number|string} subscriptionId - Subscription ID
   */
  getById: (subscriptionId) =>
    apiClient.get(`/subscriptions/${subscriptionId}`),

  /**
   * Update subscription
   * @param {number|string} subscriptionId - Subscription ID
   * @param {object} data - Updated subscription data
   */
  update: (subscriptionId, data) =>
    apiClient.put(`/subscriptions/${subscriptionId}`, data),

  /**
   * Cancel subscription
   * @param {number|string} subscriptionId - Subscription ID
   */
  cancel: (subscriptionId) =>
    apiClient.delete(`/subscriptions/${subscriptionId}`),

  /**
   * Pause subscription
   * @param {number|string} subscriptionId - Subscription ID
   */
  pause: (subscriptionId) =>
    apiClient.post(`/subscriptions/${subscriptionId}/pause`, {}),

  /**
   * Resume subscription
   * @param {number|string} subscriptionId - Subscription ID
   */
  resume: (subscriptionId) =>
    apiClient.post(`/subscriptions/${subscriptionId}/resume`, {}),
};

/**
 * Order API endpoints
 */
export const orderAPI = {
  /**
   * Create order from basket
   * @param {string} firebaseUid - User's Firebase UID
   */
  createFromBasket: (firebaseUid) => 
    apiClient.post(`/orders/create`, { firebaseUid }),

  /**
   * Get user's orders
   * @param {string} firebaseUid - User's Firebase UID
   * @param {object} options - { limit, offset, status, etc }
   */
  getUserOrders: (firebaseUid, options = {}) => {
    const params = new URLSearchParams({ firebaseUid, ...options });
    return apiClient.get(`/orders/user?${params.toString()}`);
  },

  /**
   * Get order details
   * @param {number|string} orderId - Order ID
   */
  getById: (orderId) =>
    apiClient.get(`/orders/${orderId}`),

  /**
   * Cancel order
   * @param {number|string} orderId - Order ID
   */
  cancel: (orderId) =>
    apiClient.post(`/orders/${orderId}/cancel`, {}),

  /**
   * Get order history
   * @param {string} firebaseUid - User's Firebase UID
   */
  getHistory: (firebaseUid) =>
    apiClient.get(`/orders/history/${firebaseUid}`),

  /**
   * Download invoice
   * @param {number|string} orderId - Order ID
   */
  downloadInvoice: (orderId) =>
    apiClient.get(`/orders/${orderId}/invoice`),
};

/**
 * User API endpoints
 */
export const userAPI = {
  /**
   * Get current user info
   * @param {string} firebaseUid - User's Firebase UID
   */
  getCurrentUser: (firebaseUid) => 
    apiClient.get(`/users/${firebaseUid}`),

  /**
   * Update user profile
   * @param {string} firebaseUid - User's Firebase UID
   * @param {object} data - Updated user data
   */
  updateProfile: (firebaseUid, data) =>
    apiClient.put(`/users/${firebaseUid}`, data),

  /**
   * Get user preferences
   * @param {string} firebaseUid - User's Firebase UID
   */
  getPreferences: (firebaseUid) =>
    apiClient.get(`/users/${firebaseUid}/preferences`),

  /**
   * Update user preferences
   * @param {string} firebaseUid - User's Firebase UID
   * @param {object} preferences - Updated preferences
   */
  updatePreferences: (firebaseUid, preferences) =>
    apiClient.put(`/users/${firebaseUid}/preferences`, preferences),

  /**
   * Get user address book
   * @param {string} firebaseUid - User's Firebase UID
   */
  getAddresses: (firebaseUid) =>
    apiClient.get(`/users/${firebaseUid}/addresses`),

  /**
   * Add address to user
   * @param {string} firebaseUid - User's Firebase UID
   * @param {object} address - Address data
   */
  addAddress: (firebaseUid, address) =>
    apiClient.post(`/users/${firebaseUid}/addresses`, address),

  /**
   * Update user address
   * @param {string} firebaseUid - User's Firebase UID
   * @param {number|string} addressId - Address ID
   * @param {object} address - Updated address data
   */
  updateAddress: (firebaseUid, addressId, address) =>
    apiClient.put(`/users/${firebaseUid}/addresses/${addressId}`, address),

  /**
   * Delete user address
   * @param {string} firebaseUid - User's Firebase UID
   * @param {number|string} addressId - Address ID
   */
  deleteAddress: (firebaseUid, addressId) =>
    apiClient.delete(`/users/${firebaseUid}/addresses/${addressId}`),
};

/**
 * Wishlist API endpoints
 */
export const wishlistAPI = {
  /**
   * Get user's wishlist
   * @param {string} firebaseUid - User's Firebase UID
   */
  get: (firebaseUid) =>
    apiClient.get(`/wishlist/user/${firebaseUid}`),

  /**
   * Add product to wishlist
   * @param {string} firebaseUid - User's Firebase UID
   * @param {number|string} productId - Product ID
   */
  addProduct: (firebaseUid, productId) =>
    apiClient.post(`/wishlist/user/${firebaseUid}/product/${productId}`, {}),

  /**
   * Remove product from wishlist
   * @param {string} firebaseUid - User's Firebase UID
   * @param {number|string} productId - Product ID
   */
  removeProduct: (firebaseUid, productId) =>
    apiClient.delete(`/wishlist/user/${firebaseUid}/product/${productId}`),

  /**
   * Check if product is in wishlist
   * @param {string} firebaseUid - User's Firebase UID
   * @param {number|string} productId - Product ID
   */
  isInWishlist: (firebaseUid, productId) =>
    apiClient.get(`/wishlist/user/${firebaseUid}/product/${productId}`),

  /**
   * Clear wishlist
   * @param {string} firebaseUid - User's Firebase UID
   */
  clear: (firebaseUid) =>
    apiClient.delete(`/wishlist/user/${firebaseUid}`),
};

/**
 * Payment API endpoints
 */
export const paymentAPI = {
  /**
   * Process payment
   * @param {object} data - Payment data (orderId, method, etc)
   */
  process: (data) =>
    apiClient.post('/payments', data),

  /**
   * Get payment status
   * @param {number|string} paymentId - Payment ID
   */
  getStatus: (paymentId) =>
    apiClient.get(`/payments/${paymentId}/status`),

  /**
   * Refund payment
   * @param {number|string} paymentId - Payment ID
   * @param {object} data - Refund data (amount, reason, etc)
   */
  refund: (paymentId, data) =>
    apiClient.post(`/payments/${paymentId}/refund`, data),
};

// Default export - all API modules
export default {
  productAPI,
  recommendationAPI,
  basketAPI,
  subscriptionAPI,
  orderAPI,
  userAPI,
  wishlistAPI,
  paymentAPI,
};
