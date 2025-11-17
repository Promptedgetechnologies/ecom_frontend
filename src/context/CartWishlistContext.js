import React, { createContext, useContext, useEffect, useState } from "react";
import {
  fetchCart,
  fetchWishlist,
  addToWishlist,
  removeFromWishlist,
  addOrUpdateCart,
  deleteCartItem,
} from "../api";

const CartWishlistContext = createContext();

export function CartWishlistProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [c, w] = await Promise.all([fetchCart(), fetchWishlist()]);
        setCart(c);
        setWishlist(w);
      } catch (e) {
        console.error(e);
        setError("Failed to load cart/wishlist");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const cartCount = cart?.items?.reduce((sum, it) => sum + it.quantity, 0) || 0;
  const wishlistCount = wishlist?.items?.length || 0;

  async function handleAddToCart(id, qty = 1) {
    try {
      const res = await addOrUpdateCart(id, qty);
      setCart(res);
    } catch (e) {
      console.error(e);
      alert("Unable to add to cart");
    }
  }

  async function handleUpdateQty(id, qty) {
    try {
      const res = await addOrUpdateCart(id, qty);
      setCart(res);
    } catch (e) {
      console.error(e);
      alert("Unable to update cart");
    }
  }

  async function handleRemoveFromCart(id) {
    try {
      const res = await deleteCartItem(id);
      setCart(res);
    } catch (e) {
      console.error(e);
      alert("Unable to remove from cart");
    }
  }

  async function handleAddToWishlist(id) {
    try {
      const res = await addToWishlist(id);
      setWishlist(res);
    } catch (e) {
      console.error(e);
      alert("Unable to add to wishlist");
    }
  }

  async function handleRemoveFromWishlist(id) {
    try {
      const res = await removeFromWishlist(id);
      setWishlist(res);
    } catch (e) {
      console.error(e);
      alert("Unable to remove from wishlist");
    }
  }

  return (
    <CartWishlistContext.Provider
      value={{
        cart,
        wishlist,
        loading,
        error,
        cartCount,
        wishlistCount,
        addToCart: handleAddToCart,
        updateCartQuantity: handleUpdateQty,
        removeFromCart: handleRemoveFromCart,
        addToWishlist: handleAddToWishlist,
        removeFromWishlist: handleRemoveFromWishlist,
        setCart,
      }}
    >
      {children}
    </CartWishlistContext.Provider>
  );
}

export function useCartWishlist() {
  return useContext(CartWishlistContext);
}
