import { getAuth } from 'firebase/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';

// Cache для токенов (опционально, для оптимизации)
let cachedToken = null;
let tokenExpiry = null;

/**
 * Получить Firebase токен с кешированием
 */
const getAuthToken = async () => {
  const now = Date.now();
  
  // Если токен в кеше и еще не истек, вернуть его
  if (cachedToken && tokenExpiry && tokenExpiry > now) {
    return cachedToken;
  }

  const user = getAuth().currentUser;
  if (user) {
    cachedToken = await user.getIdToken();
    // Firebase токены живут ~1 час
    tokenExpiry = now + (59 * 60 * 1000);
    return cachedToken;
  }
  
  cachedToken = null;
  tokenExpiry = null;
  return null;
};

/**
 * Универсальный API клиент с полной обработкой ошибок
 */
export const apiClient = {
  /**
   * Выполнить API запрос
   * @param {string} endpoint - путь API (например: /products)
   * @param {object} options - опции fetch
   * @returns {Promise} JSON ответ
   */
  async request(endpoint, options = {}) {
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

      // Обработка ошибок
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: `HTTP ${response.status}` };
        }

        const error = new Error(errorData.message || `API Error ${response.status}`);
        error.status = response.status;
        error.data = errorData;
        throw error;
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  },

  /**
   * GET запрос
   */
  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  },

  /**
   * POST запрос
   */
  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * PUT запрос
   */
  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * DELETE запрос
   */
  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  },

  /**
   * PATCH запрос
   */
  patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};

export default apiClient;
