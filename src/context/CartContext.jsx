/* eslint-disable react-refresh/only-export-components */
import PropTypes from 'prop-types';
import { createContext, useContext, useState, useEffect } from 'react';
import { basketAPI } from '../services/api';
import { AuthContext } from '../Auth/firebase';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const authContext = useContext(AuthContext);
  const currentUser = authContext?.currentUser;

  const firebaseUid = currentUser?.uid || "test-user-123";

  const loadCart = async () => {
    if (!firebaseUid) return;
    
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
      console.error("Error loading cart:", e);
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
      console.error("Error adding to cart:", error);
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

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + (item.price * item.quantity),
      0
    );
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  useEffect(() => {
    if (currentUser) {
      loadCart();
    } else {
      setCartItems([]);
    }
  }, [currentUser?.uid]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        handleIncrease,
        handleDecrease,
        clearCart,
        loading,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
