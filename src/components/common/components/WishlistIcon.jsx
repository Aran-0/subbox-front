import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import { useWishlist } from "../../../context/WishlistContext";

const WishlistIcon = ({ selectedProduct, style = "" }) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const { addToWishlist, removeFromWishlist, wishlistItems } = useWishlist();

  useEffect(() => {
    const wishlistItemExists = wishlistItems.some(
      (wishlistItem) => wishlistItem.id === selectedProduct.id
    );
    setIsInWishlist(wishlistItemExists);
  }, [wishlistItems, selectedProduct.id]);

  // Function to remove item from wishlist
  const handleDeleteFromWishlist = () => {
    removeFromWishlist(selectedProduct.id);
    setIsInWishlist(false);
  };

  // Function to add item to wishlist
  const handleAddToWishlist = () => {
    addToWishlist(selectedProduct);
    setIsInWishlist(true);
  };

  return (
    <div className="">
      {isInWishlist ? (
        <div className={`${style} bg-pink-100 hover:bg-pink-200 rounded-full transition-colors duration-200`}>
          <IconButton onClick={handleDeleteFromWishlist} size="small">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full hover:bg-pink-300 opacity-75"></span>
            <svg
              className="w-8 h-8 p-1 text-pink-600"
              width="18"
              height="20"
              viewBox="0 0 18 20"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17 3.57143H2.33333L3.66667 19H14.3333L15.6667 3.57143H1M9 7.42857V15.1429M12.3333 7.42857L11.6667 15.1429M5.66667 7.42857L6.33333 15.1429M6.33333 3.57143L7 1H11L11.6667 3.57143"
                stroke="currentColor"
                strokeWidth="1.56"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </IconButton>
        </div>
      ) : (
        <div className={`${style} bg-gray-100 hover:bg-indigo-100 rounded-full transition-colors duration-200`}>
          <IconButton onClick={handleAddToWishlist} size="small">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full hover:bg-indigo-200 opacity-75"></span>
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 7C8.239 7 6 9.216 6 11.95C6 14.157 6.875 19.395 15.488 24.69C15.6423 24.7839 15.8194 24.8335 16 24.8335C16.1806 24.8335 16.3577 24.7839 16.512 24.69C25.125 19.395 26 14.157 26 11.95C26 9.216 23.761 7 21 7C18.239 7 16 10 16 10C16 10 13.761 7 11 7Z"
                stroke="#6366f1"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </IconButton>
        </div>
      )}
    </div>
  );
};

export default WishlistIcon;
WishlistIcon.propTypes = {
  selectedProduct: PropTypes.shape({
    id: PropTypes.string.isRequired,
    // Add other required props for selectedProduct if necessary
  }).isRequired,
  style: PropTypes.string,
};
