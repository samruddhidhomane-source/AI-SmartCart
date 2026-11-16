
import { createContext, useEffect, useState } from "react";

export const WishlistContext = createContext();

function WishlistProvider({ children }) {
  // Load wishlist from localStorage when the app starts
  const [wishlist, setWishlist] = useState(() => {
    try {
      const savedWishlist = localStorage.getItem("wishlist");
      return savedWishlist ? JSON.parse(savedWishlist) : [];
    } catch (error) {
      console.error("Error loading wishlist:", error);
      return [];
    }
  });

  // Save wishlist whenever it changes
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Add product to wishlist
  const addToWishlist = (product) => {
    setWishlist((previousWishlist) => {
      const alreadyExists = previousWishlist.some(
        (item) => item.id === product.id
      );

      if (alreadyExists) {
        return previousWishlist;
      }

      return [...previousWishlist, product];
    });
  };

  // Remove product from wishlist
  const removeFromWishlist = (id) => {
    setWishlist((previousWishlist) =>
      previousWishlist.filter((item) => item.id !== id)
    );
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export default WishlistProvider;
