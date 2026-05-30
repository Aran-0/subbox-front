import { getAuth } from "firebase/auth";

const API_BASE_URL = "http://localhost:8081/api";

// Получить токен (только если пользователь авторизован)
const getAuthToken = async () => {
  const user = getAuth().currentUser;
  if (user) {
    return await user.getIdToken();
  }
  return null; // для публичных запросов
};

// Универсальная функция запроса
const apiRequest = async (endpoint, options = {}) => {
  try {
    const token = await getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Ошибка ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
};

// ==================== API ====================

export const productAPI = {
  getAll: () => apiRequest('/products'),                    // публичный
  getById: (id) => apiRequest(`/products/${id}`),
  getByCategory: (category) => apiRequest(`/products/category/${category}`),
};

export const recommendationAPI = {
  getForUser: (firebaseUid) => apiRequest(`/recommendations/user/${firebaseUid}`),
};

export const basketAPI = {
  get: (firebaseUid) => apiRequest(`/basket/user/${firebaseUid}`),
  
  addItem: (firebaseUid, productId, quantity = 1) => 
    apiRequest(`/basket/add?firebaseUid=${firebaseUid}&productId=${productId}&quantity=${quantity}`, {
      method: 'POST'
    }),
};

export const subscriptionAPI = {
  getUserSubscriptions: (firebaseUid) => apiRequest(`/subscriptions/user/${firebaseUid}`),
  
  create: (subscriptionData) => apiRequest('/subscriptions', {
    method: 'POST',
    body: JSON.stringify(subscriptionData)
  }),
};

export const orderAPI = {
  createFromBasket: (firebaseUid) => apiRequest(`/orders/create?firebaseUid=${firebaseUid}`, {
    method: 'POST'
  }),
  
  getUserOrders: (firebaseUid) => apiRequest(`/orders/user/${firebaseUid}`),
};

export const userAPI = {
  getCurrentUser: (firebaseUid) => apiRequest(`/users/${firebaseUid}`),
};

// Экспорт
export default {
  productAPI,
  recommendationAPI,
  basketAPI,
  subscriptionAPI,
  orderAPI,
  userAPI
};