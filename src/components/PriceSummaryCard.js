import React from "react";

function PriceSummaryCard({
  subtotal,
  discount_total,
  tax,
  total,
  buttonText,
  onButtonClick,
  disabled,
}) {
  return (
    <div className="card">
      <h3 style={{ fontSize: "1rem", marginBottom: 6 }}>Price Summary</h3>
      <div style={{ fontSize: "0.9rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Discount</span>
          <span style={{ color: "#16a34a" }}>
            -₹{discount_total.toFixed(2)}
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Tax</span>
          <span>₹{tax.toFixed(2)}</span>
        </div>
        <hr />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontWeight: 600 }}>Total</span>
          <span style={{ fontWeight: 600 }}>₹{total.toFixed(2)}</span>
        </div>
      </div>
      {buttonText && (
        <button
          disabled={disabled}
          onClick={onButtonClick}
          style={{
            marginTop: 10,
            width: "100%",
            padding: "0.5rem",
            borderRadius: 4,
            border: "none",
            background: disabled ? "#9ca3af" : "#f97316",
            color: "white",
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}

export default PriceSummaryCard;
