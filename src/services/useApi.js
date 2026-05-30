/**
 * Custom hooks for API calls with loading and error states
 */

import { useState, useCallback } from 'react';

/**
 * Hook for API requests with loading/error handling
 * @param {Function} apiFunction - API function to call
 * @param {object} options - Configuration options
 * @returns {object} { execute, data, loading, error, success }
 */
export const useApiCall = (apiFunction, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const execute = useCallback(
    async (...args) => {
      try {
        setLoading(true);
        setError(null);
        setSuccess(false);

        const result = await apiFunction(...args);
        setData(result);
        setSuccess(true);

        if (options.onSuccess) {
          options.onSuccess(result);
        }

        return result;
      } catch (err) {
        const errorMessage = err.message || 'An error occurred';
        setError(errorMessage);
        setSuccess(false);

        if (options.onError) {
          options.onError(err);
        }

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, options]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setSuccess(false);
  }, []);

  return {
    execute,
    data,
    loading,
    error,
    success,
    reset,
  };
};

/**
 * Hook for fetching data on component mount
 * @param {Function} apiFunction - API function to call
 * @param {array} args - Arguments to pass to API function
 * @param {object} options - Configuration options
 * @returns {object} { data, loading, error, refetch }
 */
export const useFetch = (apiFunction, args = [], options = {}) => {
  const { execute, data, loading, error, reset } = useApiCall(apiFunction, options);

  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  React.useEffect(() => {
    if (isMounted && !options.skip) {
      execute(...args);
    }
  }, [execute, args, isMounted, options.skip]);

  const refetch = useCallback(() => {
    execute(...args);
  }, [execute, args]);

  return {
    data,
    loading,
    error,
    refetch,
    reset,
  };
};

/**
 * Hook for managing form submission with API call
 * @param {Function} apiFunction - API function to call
 * @param {object} options - Configuration options
 * @returns {object} { submit, data, loading, error, success }
 */
export const useApiMutation = (apiFunction, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const execute = useCallback(
    async (...args) => {
      try {
        setLoading(true);
        setError(null);
        setSuccess(false);

        const result = await apiFunction(...args);
        setData(result);
        setSuccess(true);

        if (options.onSuccess) {
          options.onSuccess(result);
        }

        return result;
      } catch (err) {
        const errorMessage = err.message || 'An error occurred';
        setError(errorMessage);

        if (options.onError) {
          options.onError(err);
        }

        if (!options.throwError) {
          return null;
        }

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, options]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setSuccess(false);
  }, []);

  return {
    execute,
    data,
    loading,
    error,
    success,
    reset,
  };
};

import React from 'react';
