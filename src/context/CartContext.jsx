/* eslint-disable react-refresh/only-export-components */
import PropTypes from 'prop-types';
import { createContext, useContext, useState, useEffect } from 'react';
import { basketAPI } from '../services/api';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const firebaseUid = "test-user-123"; // временно

  const loadCart = async () => {
    setLoading(true);
    try {
      const basket = await basketAPI.get(firebaseUid);
      const items = basket.items?.map(item => ({
        id: item.product.id,
        title: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        imageSrc: item.product.image || `https://picsum.photos/id/201/80/80`,
      })) || [];
      setCartItems(items);
    } catch (e) {
      console.error(e);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      await basketAPI.addItem(firebaseUid, productId, quantity);
      await loadCart();
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const handleIncrease = (product) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === product.id
          ? { ...item, quantity: (item.quantity || 0) + 1 }
          : item
      )
    );
  };

  const handleDecrease = (product) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === product.id
            ? { ...item, quantity: Math.max((item.quantity || 1) - 1, 0) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  useEffect(() => {
    loadCart();
  }, []);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, handleIncrease, handleDecrease, loading }}
    >
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};