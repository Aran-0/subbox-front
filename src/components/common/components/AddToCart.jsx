import { useState, useEffect } from "react";
import { useCart } from "../../../context/CartContext";

const useAddToCart = (item) => {
  const { addToCart, cartItems, removeFromCart } = useCart();
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    const cartItemExists = cartItems.some(
      (cartItem) => cartItem.id === item.id
    );
    setIsInCart(cartItemExists);
  }, [cartItems, item.id]);

  const handleAddToCart = () => {
    if (isInCart) {
      removeFromCart(item.id);
      setIsInCart(false);
    } else {
      addToCart(item.id, 1);
      setIsInCart(true);
    }
  };

  return { handleAddToCart, isInCart };
};

export default useAddToCart;
