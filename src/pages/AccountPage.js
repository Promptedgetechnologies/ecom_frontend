import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchOrders } from "../api";
import { useUser } from "../context/UserContext";

function AccountPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user, signOut } = useUser();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      setOrders([]);
      return;
    }
    (async () => {
      try {
        setLoading(true);
        const data = await fetchOrders();
        setOrders(data || []);
      } catch (e) {
        console.error(e);
        setError("Failed to load account overview");
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const latestOrder = orders[orders.length - 1];
  const customer = latestOrder?.customer;

  return (
    <div className="page-container">
      <h1 style={{ fontSize: "1.4rem", marginBottom: 8 }}>Your Account</h1>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: "#b91c1c" }}>{error}</div>}

      <div className="card" style={{ marginTop: 8 }}>
        {user ? (
          <>
            <p style={{ margin: 0, fontSize: "0.95rem" }}>
              Signed in as <strong>{user.name}</strong>. This is a demo
              experience – no real account data is stored.
            </p>
            <button
              type="button"
              onClick={() => {
                signOut();
                navigate("/", { replace: true });
              }}
              style={{
                marginTop: 8,
                padding: "0.35rem 0.7rem",
                borderRadius: 9999,
                border: "1px solid #e5e7eb",
                background: "#f9fafb",
                fontSize: "0.8rem",
                cursor: "pointer",
              }}
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <p style={{ margin: 0, fontSize: "0.95rem" }}>
              You are not signed in. Use the demo sign-in to personalise your
              experience.
            </p>
            <button
              type="button"
              onClick={() => navigate("/signin")}
              style={{
                marginTop: 8,
                padding: "0.35rem 0.7rem",
                borderRadius: 9999,
                border: "none",
                background: "#f97316",
                color: "white",
                fontSize: "0.85rem",
                cursor: "pointer",
              }}
            >
              Sign in
            </button>
          </>
        )}
      </div>

      <div
        style={{
          marginTop: 12,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "0.75rem",
        }}
      >
        <div className="card">
          <h2 style={{ fontSize: "1rem", marginTop: 0 }}>Your Orders</h2>
          <p style={{ fontSize: "0.85rem" }}>
            You have placed <strong>{orders.length}</strong> orders in this demo.
          </p>
          <button
            type="button"
            onClick={() => navigate("/orders")}
            style={{
              marginTop: 6,
              padding: "0.4rem 0.7rem",
              borderRadius: 4,
              border: "none",
              background: "#f97316",
              color: "white",
              fontSize: "0.85rem",
              cursor: "pointer",
            }}
          >
            View your orders
          </button>
        </div>

        <div className="card">
          <h2 style={{ fontSize: "1rem", marginTop: 0 }}>Default address</h2>
          {customer ? (
            <p style={{ fontSize: "0.85rem" }}>
              {customer.full_name}
              <br />
              {customer.address_line1} {customer.address_line2}
              <br />
              {customer.city} - {customer.postal_code}, {customer.country}
            </p>
          ) : (
            <p style={{ fontSize: "0.85rem" }}>
              Place an order in this demo to see a sample address here.
            </p>
          )}
        </div>

        <div className="card">
          <h2 style={{ fontSize: "1rem", marginTop: 0 }}>Login &amp; Security</h2>
          <p style={{ fontSize: "0.85rem" }}>
            Authentication is not implemented for this demo. In a real app, this
            is where you would manage your login, password and security
            information.
          </p>
        </div>

        <div className="card">
          <h2 style={{ fontSize: "1rem", marginTop: 0 }}>Seller / B2B account</h2>
          <p style={{ fontSize: "0.85rem" }}>
            Switch to the seller view to see a business-style overview of your
            demo orders, revenue and catalog. This uses the same mock data and
            does not perform any real transactions.
          </p>
          <button
            type="button"
            onClick={() => navigate("/seller")}
            style={{
              marginTop: 6,
              padding: "0.4rem 0.7rem",
              borderRadius: 4,
              border: "none",
              background: "#f97316",
              color: "white",
              fontSize: "0.85rem",
              cursor: "pointer",
            }}
          >
            Go to seller dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default AccountPage;
