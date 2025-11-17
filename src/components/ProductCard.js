import React from "react";
import { useNavigate } from "react-router-dom";

function ProductCard({ product, onAddToCart, onAddToWishlist, businessPrimary = false }) {
  const navigate = useNavigate();
  const {
    id,
    title,
    price,
    original_price,
    discount_percentage,
    rating,
    rating_count,
    image_url,
    in_stock,
  } = product;

  const businessPrice = price * 0.9;

  return (
    <div
      className="card"
      style={{ display: "flex", flexDirection: "column", height: "100%" }}
    >
      <div style={{ cursor: "pointer" }} onClick={() => navigate(`/product/${id}`)}>
        <div
          style={{
            borderRadius: 6,
            overflow: "hidden",
            marginBottom: "0.5rem",
            background: "#e5e7eb",
          }}
        >
          <img
            src={image_url}
            alt={title}
            style={{ width: "100%", height: 180, objectFit: "cover" }}
          />
        </div>
        <div style={{ fontSize: "0.9rem", fontWeight: 500 }}>{title}</div>
        <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>
          ★ {rating.toFixed(1)} ({rating_count})
        </div>
        {businessPrimary ? (
          <>
            <div style={{ marginTop: "0.25rem", fontSize: "0.9rem" }}>
              <span
                style={{
                  display: "inline-block",
                  padding: "0.05rem 0.4rem",
                  borderRadius: 9999,
                  background: "#fef3c7",
                  color: "#92400e",
                  fontWeight: 600,
                  marginRight: 4,
                }}
              >
                Business
              </span>
              <span style={{ fontWeight: 600 }}>
                ₹{businessPrice.toFixed(2)}
              </span>
            </div>
            <div
              style={{
                marginTop: "0.15rem",
                fontSize: "0.75rem",
                color: "#4b5563",
              }}
            >
              Standard: ₹{price.toFixed(2)} ({discount_percentage.toFixed(0)}% off)
            </div>
          </>
        ) : (
          <>
            <div style={{ marginTop: "0.25rem", fontSize: "0.9rem" }}>
              <span style={{ fontWeight: 600 }}>₹{price.toFixed(2)}</span>{" "}
              <span
                style={{
                  textDecoration: "line-through",
                  color: "#9ca3af",
                  fontSize: "0.8rem",
                }}
              >
                ₹{original_price.toFixed(2)}
              </span>{" "}
              <span style={{ color: "#16a34a", fontSize: "0.8rem" }}>
                {discount_percentage.toFixed(0)}% off
              </span>
            </div>
            <div
              style={{
                marginTop: "0.15rem",
                fontSize: "0.75rem",
                color: "#4b5563",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  padding: "0.05rem 0.4rem",
                  borderRadius: 9999,
                  background: "#fef3c7",
                  color: "#92400e",
                  fontWeight: 600,
                  marginRight: 4,
                }}
              >
                Business
              </span>
              <span>₹{businessPrice.toFixed(2)} (demo)</span>
            </div>
          </>
        )}
        {!in_stock && (
          <div style={{ color: "#b91c1c", fontSize: "0.8rem" }}>Out of stock</div>
        )}
      </div>
      <div
        style={{
          marginTop: "0.5rem",
          display: "flex",
          gap: "0.5rem",
        }}
      >
        <button
          disabled={!in_stock}
          onClick={() => onAddToCart && onAddToCart(id)}
          style={{
            flex: 1,
            padding: "0.35rem 0.5rem",
            borderRadius: 4,
            border: "none",
            background: in_stock ? "#22c55e" : "#9ca3af",
            color: "white",
            fontSize: "0.8rem",
            cursor: in_stock ? "pointer" : "not-allowed",
          }}
        >
          Add to Cart
        </button>
        <button
          onClick={() => onAddToWishlist && onAddToWishlist(id)}
          style={{
            flex: 1,
            padding: "0.35rem 0.5rem",
            borderRadius: 4,
            border: "1px solid #e5e7eb",
            background: "white",
            fontSize: "0.8rem",
            cursor: "pointer",
          }}
        >
          Wishlist
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
