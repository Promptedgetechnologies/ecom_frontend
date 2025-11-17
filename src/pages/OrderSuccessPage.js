import React from "react";
import { useLocation, Link } from "react-router-dom";
import { API_BASE_URL } from "../api";

function OrderSuccessPage() {
  const location = useLocation();
  const orderId = location.state?.orderId;
  const invoiceUrl = location.state?.invoiceUrl;

  return (
    <div className="page-container order-success-page">
      <div className="order-success-card">
        <div className="order-success-badge">✓</div>
        <h1 className="order-success-title">Order placed successfully</h1>
        <p className="order-success-subtitle">
          Thank you for shopping with PromptEdgeStore.
        </p>

        {orderId ? (
          <>
            <div className="order-success-row">
              <span className="order-success-label">Order ID</span>
              <span className="order-success-value">{orderId}</span>
            </div>
            {invoiceUrl && (
              <div className="order-success-row">
                <span className="order-success-label">Invoice</span>
                <a
                  href={`${API_BASE_URL}${invoiceUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="order-success-link"
                >
                  Download invoice
                </a>
              </div>
            )}
          </>
        ) : (
          <p className="order-success-subtitle">
            No order info found (page was refreshed and state was cleared).
          </p>
        )}

        <div className="order-success-actions">
          {invoiceUrl && (
            <button
              type="button"
              className="order-success-button order-success-button-secondary"
              onClick={() =>
                window.open(`${API_BASE_URL}${invoiceUrl}`, "_blank", "noopener,noreferrer")
              }
            >
              Print invoice
            </button>
          )}
          <Link to="/orders" className="order-success-button order-success-button-secondary">
            View all orders
          </Link>
          <Link to="/products" className="order-success-button order-success-button-primary">
            Continue shopping
          </Link>
        </div>

        <p className="order-success-hint">
          You can always download this invoice later from the Orders page.
        </p>
      </div>
    </div>
  );
}

export default OrderSuccessPage;
