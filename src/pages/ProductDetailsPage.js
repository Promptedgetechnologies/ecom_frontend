import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProductById } from "../api";
import { useCartWishlist } from "../context/CartWishlistContext";

function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToCart, addToWishlist } = useCartWishlist();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const p = await fetchProductById(id);
        setProduct(p);
      } catch (e) {
        console.error(e);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="page-container">Loading...</div>;
  if (error) return <div className="page-container">{error}</div>;
  if (!product) return <div className="page-container">Product not found.</div>;

  return (
    <div className="page-container">
      <div
        className="card"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,2fr) minmax(0,3fr)",
          gap: "1rem",
        }}
      >
        <div
          style={{
            borderRadius: 8,
            overflow: "hidden",
            background: "#e5e7eb",
          }}
        >
          <img
            src={product.image_url}
            alt={product.title}
            style={{ width: "100%", maxHeight: 400, objectFit: "cover" }}
          />
        </div>
        <div>
          <h1 style={{ fontSize: "1.5rem", marginBottom: 4 }}>{product.title}</h1>
          <div style={{ fontSize: "0.9rem", color: "#6b7280" }}>
            ★ {product.rating.toFixed(1)} ({product.rating_count}) · {product.brand}
          </div>
          <div style={{ marginTop: 8, fontSize: "1.1rem" }}>
            <span style={{ fontWeight: 700 }}>₹{product.price.toFixed(2)}</span>{" "}
            <span
              style={{
                textDecoration: "line-through",
                color: "#9ca3af",
                fontSize: "0.9rem",
              }}
            >
              ₹{product.original_price.toFixed(2)}
            </span>{" "}
            <span style={{ color: "#16a34a", fontSize: "0.9rem" }}>
              {product.discount_percentage.toFixed(0)}% off
            </span>
          </div>
          <div style={{ marginTop: 4, fontSize: "0.85rem", color: "#4b5563" }}>
            Business price (demo):
            <span style={{ fontWeight: 600 }}> ₹{(product.price * 0.9).toFixed(2)}</span>
          </div>
          <p style={{ marginTop: 10, fontSize: "0.95rem" }}>{product.description}</p>
          <div style={{ marginTop: 12, fontSize: "0.9rem" }}>
            Availability:{" "}
            <span
              style={{
                color: product.in_stock ? "#16a34a" : "#b91c1c",
                fontWeight: 600,
              }}
            >
              {product.in_stock ? "In stock" : "Out of stock"}
            </span>
          </div>
          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            <button
              disabled={!product.in_stock}
              onClick={() => addToCart(product.id, 1)}
              style={{
                padding: "0.5rem 0.75rem",
                borderRadius: 4,
                border: "none",
                background: product.in_stock ? "#f97316" : "#9ca3af",
                color: "white",
                cursor: product.in_stock ? "pointer" : "not-allowed",
              }}
            >
              Add to Cart
            </button>
            <button
              onClick={() => addToWishlist(product.id)}
              style={{
                padding: "0.5rem 0.75rem",
                borderRadius: 4,
                border: "1px solid #e5e7eb",
                background: "white",
                cursor: "pointer",
              }}
            >
              Add to Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsPage;
