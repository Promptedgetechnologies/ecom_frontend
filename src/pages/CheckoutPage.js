import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartWishlist } from "../context/CartWishlistContext";
import PriceSummaryCard from "../components/PriceSummaryCard";
import { checkout, createInvoice } from "../api";

function CheckoutPage() {
  const { cart, setCart } = useCartWishlist();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("CARD");
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    postal_code: "",
    country: "India",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!cart || !cart.items?.length) {
    return (
      <div className="page-container">
        <h1>Checkout</h1>
        <p>Your cart is empty.</p>
      </div>
    );
  }

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = async () => {
    setError("");
    if (!form.full_name || !form.address_line1 || !form.city) {
      setError("Please fill required address fields.");
      return;
    }
    try {
      setLoading(true);
      const payload = { customer: form, payment_method: paymentMethod };
      const res = await checkout(payload);
      setCart({ items: [], subtotal: 0, discount_total: 0, tax: 0, total: 0 });
      const invoice = await createInvoice(res.order_id);
      navigate("/order-success", {
        state: { orderId: res.order_id, invoiceUrl: invoice.invoice_url },
      });
    } catch (e) {
      console.error(e);
      setError("Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1 style={{ fontSize: "1.25rem", marginBottom: 8 }}>Checkout</h1>
      {error && <div style={{ color: "#b91c1c" }}>{error}</div>}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,3fr) minmax(0,2fr)",
          gap: "1rem",
        }}
      >
        <div className="card">
          <h2 style={{ fontSize: "1rem" }}>Shipping Address</h2>
          <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
            <input
              name="full_name"
              placeholder="Full name"
              value={form.full_name}
              onChange={handleChange}
            />
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />
            <input
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
            />
            <input
              name="address_line1"
              placeholder="Address line 1"
              value={form.address_line1}
              onChange={handleChange}
            />
            <input
              name="address_line2"
              placeholder="Address line 2"
              value={form.address_line2}
              onChange={handleChange}
            />
            <input
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
            />
            <input
              name="postal_code"
              placeholder="Postal code"
              value={form.postal_code}
              onChange={handleChange}
            />
            <input
              name="country"
              placeholder="Country"
              value={form.country}
              onChange={handleChange}
            />
          </div>
          <h2 style={{ fontSize: "1rem", marginTop: 16 }}>Payment</h2>
          <div style={{ fontSize: "0.9rem", marginTop: 4 }}>
            <label>
              <input
                type="radio"
                name="pm"
                value="CARD"
                checked={paymentMethod === "CARD"}
                onChange={() => setPaymentMethod("CARD")}
              />
              {" "}Card (dummy)
            </label>{" "}
            <label>
              <input
                type="radio"
                name="pm"
                value="UPI"
                checked={paymentMethod === "UPI"}
                onChange={() => setPaymentMethod("UPI")}
              />
              {" "}UPI (dummy)
            </label>{" "}
            <label>
              <input
                type="radio"
                name="pm"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={() => setPaymentMethod("COD")}
              />
              {" "}Cash on Delivery (dummy)
            </label>
          </div>
        </div>
        <PriceSummaryCard
          subtotal={cart.subtotal}
          discount_total={cart.discount_total}
          tax={cart.tax}
          total={cart.total}
          buttonText={loading ? "Placing Order..." : "Place Order"}
          disabled={loading}
          onButtonClick={handlePlaceOrder}
        />
      </div>
    </div>
  );
}

export default CheckoutPage;
