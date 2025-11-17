import React from "react";
import { useCartWishlist } from "../context/CartWishlistContext";
import ProductCard from "../components/ProductCard";

function WishlistPage() {
  const {
    wishlist,
    loading,
    error,
    addToCart,
    addToWishlist,
    removeFromWishlist,
  } = useCartWishlist();

  return (
    <div className="page-container">
      <h1 style={{ fontSize: "1.25rem", marginBottom: 8 }}>Wishlist</h1>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: "#b91c1c" }}>{error}</div>}
      {!loading && wishlist?.items?.length === 0 && <div>No items in wishlist.</div>}
      <div className="products-grid">
        {wishlist?.items?.map((p) => (
          <div key={p.id}>
            <ProductCard
              product={p}
              onAddToCart={addToCart}
              onAddToWishlist={addToWishlist}
            />
            <button
              onClick={() => removeFromWishlist(p.id)}
              style={{
                marginTop: 4,
                fontSize: "0.8rem",
                border: "none",
                background: "transparent",
                color: "#b91c1c",
                cursor: "pointer",
              }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WishlistPage;
