/**
 * API Error Handling Utilities
 */

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }

  /**
   * Check if error is a client error (4xx)
   */
  isClientError() {
    return this.status >= 400 && this.status < 500;
  }

  /**
   * Check if error is a server error (5xx)
   */
  isServerError() {
    return this.status >= 500;
  }

  /**
   * Check if error is a validation error (422)
   */
  isValidationError() {
    return this.status === 422;
  }

  /**
   * Check if error is an authentication error (401)
   */
  isAuthError() {
    return this.status === 401;
  }

  /**
   * Check if error is an authorization error (403)
   */
  isForbiddenError() {
    return this.status === 403;
  }

  /**
   * Check if error is a not found error (404)
   */
  isNotFoundError() {
    return this.status === 404;
  }
}

/**
 * Handle API error and format for display
 * @param {Error} error - Error object
 * @returns {object} Formatted error object
 */
export const handleApiError = (error) => {
  if (error instanceof ApiError) {
    return {
      message: error.message,
      status: error.status,
      isClientError: error.isClientError(),
      isServerError: error.isServerError(),
      isValidationError: error.isValidationError(),
      isAuthError: error.isAuthError(),
      data: error.data,
    };
  }

  return {
    message: error.message || 'An unexpected error occurred',
    status: null,
    isClientError: false,
    isServerError: false,
    isValidationError: false,
    isAuthError: false,
    data: null,
  };
};

/**
 * Get user-friendly error message
 * @param {Error} error - Error object
 * @param {object} customMessages - Custom error messages
 * @returns {string} User-friendly error message
 */
export const getErrorMessage = (error, customMessages = {}) => {
  const formattedError = handleApiError(error);

  // Check custom messages first
  if (customMessages[formattedError.status]) {
    return customMessages[formattedError.status];
  }

  // Common status code messages
  const statusMessages = {
    400: 'Bad request. Please check your input.',
    401: 'Please log in to continue.',
    403: 'You do not have permission to perform this action.',
    404: 'The requested resource was not found.',
    422: 'Please check the information you provided.',
    429: 'Too many requests. Please try again later.',
    500: 'Server error. Please try again later.',
    503: 'Service unavailable. Please try again later.',
  };

  if (statusMessages[formattedError.status]) {
    return statusMessages[formattedError.status];
  }

  // Default messages
  if (formattedError.isClientError) {
    return 'There was a problem with your request.';
  }

  if (formattedError.isServerError) {
    return 'Server error. Please try again later.';
  }

  return formattedError.message || 'An unexpected error occurred.';
};

/**
 * Retry logic for failed API calls
 * @param {Function} fn - Async function to retry
 * @param {object} options - Retry options
 * @returns {Promise} Result of function
 */
export const retryApiCall = async (
  fn,
  {
    maxAttempts = 3,
    delayMs = 1000,
    backoffMultiplier = 2,
    shouldRetry = (error) => error.isServerError?.(),
  } = {}
) => {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Check if we should retry
      if (!shouldRetry(error) || attempt === maxAttempts) {
        throw error;
      }

      // Calculate delay with exponential backoff
      const delay = delayMs * Math.pow(backoffMultiplier, attempt - 1);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
};

/**
 * Validate API response
 * @param {any} data - Response data to validate
 * @param {Function} schema - Validation schema (e.g., Zod, Yup)
 * @returns {object} Validation result
 */
export const validateApiResponse = (data, schema) => {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Validation failed',
      details: error.issues || [],
    };
  }
};
