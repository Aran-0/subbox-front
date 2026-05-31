/**
 * Example component showing API integration
 */

import { useState } from 'react';
import { useAuth } from '@/Auth/firebase'; // Adjust path if needed
import { useFetch, useApiMutation } from '@/services/useApi';
import { productAPI, basketAPI } from '@/services/api';
import { getErrorMessage } from '@/services/errorHandler';

export default function ProductExample() {
  // Get current user from Firebase
  const { user } = useAuth();

  // Fetch all products on component mount
  const {
    data: products,
    loading: productsLoading,
    error: productsError,
    refetch,
  } = useFetch(productAPI.getAll, [], {
    onSuccess: (data) => console.log('Products loaded:', data),
    onError: (error) => console.error('Failed to load products:', error),
  });

  // Mutation hook for adding to basket
  const {
    execute: addToBasket,
    loading: isAdding,
    error: basketError,
    success: basketSuccess,
  } = useApiMutation(
    (productId, quantity) =>
      basketAPI.addItem(user?.uid, productId, quantity),
    {
      onSuccess: () => {
        console.log('Item added to basket');
        // Optional: refetch basket or show success message
      },
      onError: (error) => {
        console.error('Failed to add to basket:', error);
      },
    }
  );

  const handleAddToBasket = async (productId) => {
    if (!user) {
      console.log('User must be logged in');
      return;
    }

    try {
      await addToBasket(productId, 1);
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(message);
    }
  };

  // Error messages
  const errorMessage = productsError || basketError;

  if (productsLoading) return <div className="p-4">Loading products...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Products</h1>

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errorMessage}
          <button
            onClick={refetch}
            className="ml-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      )}

      {basketSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          ✓ Item added to basket successfully!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products?.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg shadow-md p-4 hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
            <p className="text-gray-600 mb-2">{product.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-blue-600">
                ${product.price}
              </span>
              <button
                onClick={() => handleAddToBasket(product.id)}
                disabled={isAdding || !user}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {isAdding ? 'Adding...' : 'Add to Basket'}
              </button>
            </div>
            {!user && (
              <p className="text-sm text-orange-600 mt-2">
                Please log in to add items
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
