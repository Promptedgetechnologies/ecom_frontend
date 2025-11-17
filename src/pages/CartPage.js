import React from "react";
import { useNavigate } from "react-router-dom";
import { useCartWishlist } from "../context/CartWishlistContext";
import PriceSummaryCard from "../components/PriceSummaryCard";

function CartPage() {
  const { cart, loading, error, updateCartQuantity, removeFromCart } =
    useCartWishlist();
  const navigate = useNavigate();

  const items = cart?.items || [];

  return (
    <div className="page-container">
      <h1 style={{ fontSize: "1.25rem", marginBottom: 8 }}>Cart</h1>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: "#b91c1c" }}>{error}</div>}
      {!loading && !items.length && <div>Your cart is empty.</div>}
      {items.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0,3fr) minmax(0,2fr)",
            gap: "1rem",
          }}
        >
          <div className="card">
            {items.map((it) => (
              <div
                key={it.product.id}
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  borderBottom: "1px solid #e5e7eb",
                  paddingBottom: 8,
                  marginBottom: 8,
                }}
              >
                <img
                  src={it.product.image_url}
                  alt={it.product.title}
                  style={{ width: 80, height: 80, objectFit: "cover" }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.95rem", fontWeight: 500 }}>
                    {it.product.title}
                  </div>
                  <div style={{ fontSize: "0.85rem" }}>
                    ₹{it.product.price.toFixed(2)} × {it.quantity} = ₹
                    {it.item_total.toFixed(2)}
                  </div>
                  <div style={{ marginTop: 4 }}>
                    <label style={{ fontSize: "0.8rem" }}>
                      Qty:{" "}
                      <input
                        type="number"
                        min="1"
                        value={it.quantity}
                        onChange={(e) =>
                          updateCartQuantity(
                            it.product.id,
                            Number(e.target.value)
                          )
                        }
                        style={{ width: 60 }}
                      />
                    </label>
                    <button
                      onClick={() => removeFromCart(it.product.id)}
                      style={{
                        marginLeft: 8,
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
                </div>
              </div>
            ))}
          </div>
          <PriceSummaryCard
            subtotal={cart.subtotal}
            discount_total={cart.discount_total}
            tax={cart.tax}
            total={cart.total}
            buttonText="Proceed to Checkout"
            disabled={!items.length}
            onButtonClick={() => navigate("/checkout")}
          />
        </div>
      )}
    </div>
  );
}

export default CartPage;
