import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useB2B } from "../context/B2BContext";
import { fetchOrders } from "../api";

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const { b2bMode } = useB2B();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await fetchOrders();
        setOrders(data || []);
      } catch (e) {
        console.error(e);
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (b2bMode) {
      setFilter("b2b");
    } else if (filter === "b2b") {
      setFilter("all");
    }
  }, [b2bMode]);

  const visibleOrders = orders
    .filter((o) => {
      if (filter === "b2b") return o.status === "CONFIRMED_B2B";
      if (filter === "consumer") return o.status !== "CONFIRMED_B2B";
      return true;
    })
    .slice()
    .reverse();

  return (
    <div className="page-container">
      <h1 style={{ fontSize: "1.4rem", marginBottom: 8 }}>Your Orders</h1>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: "#b91c1c" }}>{error}</div>}
      {!loading && orders.length === 0 && (
        <div className="card">
          <p style={{ margin: 0, fontSize: "0.9rem" }}>
            You have no orders yet in this demo. Add items to your cart and go
            through checkout to create one.
          </p>
          <p style={{ marginTop: 8 }}>
            <Link to="/products" style={{ color: "#2563eb" }}>
              Browse products
            </Link>
          </p>
        </div>
      )}
      {!loading && orders.length > 0 && (
        <div
          style={{
            marginBottom: 8,
            display: "flex",
            gap: 6,
            fontSize: "0.8rem",
          }}
        >
          <span>Show:</span>
          {["all", "consumer", "b2b"].map((key) => {
            const label =
              key === "all" ? "All" : key === "consumer" ? "Consumer" : "B2B";
            const active = filter === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                style={{
                  padding: "0.2rem 0.55rem",
                  borderRadius: 9999,
                  border: active ? "1px solid #2563eb" : "1px solid #e5e7eb",
                  background: active ? "#dbeafe" : "#f9fafb",
                  cursor: "pointer",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {visibleOrders.map((order) => (
            <div key={order.id} className="card">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.85rem",
                  marginBottom: 6,
                }}
              >
                <div>
                  <div>
                    <strong>Order placed:</strong> {order.created_at}
                  </div>
                  <div>
                    <strong>Total:</strong> ₹{order.total.toFixed(2)}
                  </div>
                  <div>
                    <strong>Order ID:</strong> {order.id}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  {order.status === "CONFIRMED_B2B" && (
                    <>
                      <div
                        style={{
                          marginBottom: 4,
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "0.1rem 0.45rem",
                          borderRadius: 9999,
                          fontSize: "0.7rem",
                          background: "#eef2ff",
                          color: "#3730a3",
                          fontWeight: 600,
                        }}
                      >
                        B2B order
                      </div>
                      <div style={{ marginBottom: 2 }}>
                        <Link to="/seller" style={{ fontSize: "0.75rem", color: "#2563eb" }}>
                          View in seller dashboard
                        </Link>
                      </div>
                    </>
                  )}
                  <div style={{ fontWeight: 600 }}>Shipping to</div>
                  <div>{order.customer.full_name}</div>
                  <div style={{ fontSize: "0.8rem" }}>{order.customer.city}</div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  marginTop: 4,
                }}
              >
                {order.items.map((it) => (
                  <div
                    key={it.product.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      fontSize: "0.8rem",
                      border: "1px solid #e5e7eb",
                      borderRadius: 6,
                      padding: "0.35rem 0.45rem",
                    }}
                  >
                    <img
                      src={it.product.image_url}
                      alt={it.product.title}
                      style={{
                        width: 40,
                        height: 40,
                        objectFit: "cover",
                        borderRadius: 4,
                      }}
                    />
                    <div>
                      <div style={{ fontWeight: 500 }}>{it.product.title}</div>
                      <div>
                        Qty {it.quantity} · ₹{it.product.price.toFixed(2)} each
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default OrdersPage;
