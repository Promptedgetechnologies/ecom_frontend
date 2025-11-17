import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchOrders,
  fetchProducts,
  updateProductStock,
  createSellerOrder,
} from "../api";
import { useUser } from "../context/UserContext";

function SellerDashboardPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState("");
  const [b2bItems, setB2bItems] = useState([]);
  const [b2bProductId, setB2bProductId] = useState("");
  const [b2bQty, setB2bQty] = useState(1);
  const [b2bStatus, setB2bStatus] = useState("");
  const [b2bSubmitting, setB2bSubmitting] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await fetchOrders();
        setOrders(data || []);
      } catch (e) {
        console.error(e);
        setError("Failed to load seller overview");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setCatalogLoading(true);
        const data = await fetchProducts();
        setProducts(data.products || []);
      } catch (e) {
        console.error(e);
        setCatalogError("Failed to load catalog");
      } finally {
        setCatalogLoading(false);
      }
    })();
  }, []);

  const stats = useMemo(() => {
    if (!orders.length) {
      return {
        totalOrders: 0,
        totalRevenue: 0,
        lastOrderAt: "-",
        avgOrderValue: 0,
      };
    }
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const lastOrderAt = orders[orders.length - 1].created_at;
    const avgOrderValue = totalRevenue / totalOrders;
    return { totalOrders, totalRevenue, lastOrderAt, avgOrderValue };
  }, [orders]);

  const b2bStats = useMemo(() => {
    const b2bOrders = orders.filter((o) => o.status === "CONFIRMED_B2B");
    if (!b2bOrders.length) {
      return {
        totalOrders: 0,
        totalRevenue: 0,
        lastOrderAt: "-",
        avgOrderValue: 0,
      };
    }
    const totalOrders = b2bOrders.length;
    const totalRevenue = b2bOrders.reduce((sum, o) => sum + o.total, 0);
    const lastOrderAt = b2bOrders[b2bOrders.length - 1].created_at;
    const avgOrderValue = totalRevenue / totalOrders;
    return { totalOrders, totalRevenue, lastOrderAt, avgOrderValue };
  }, [orders]);

  const b2bAdvanced = useMemo(() => {
    const b2bOrders = orders.filter((o) => o.status === "CONFIRMED_B2B");
    const now = new Date();
    const msInDay = 24 * 60 * 60 * 1000;
    let allRevenue = 0;
    let last7Revenue = 0;
    let last30Revenue = 0;
    let allCount = 0;
    let last7Count = 0;
    let last30Count = 0;
    const byCity = {};
    b2bOrders.forEach((o) => {
      allRevenue += o.total;
      allCount += 1;
      const date = new Date(o.created_at);
      const diffDays = (now - date) / msInDay;
      if (diffDays <= 7) {
        last7Revenue += o.total;
        last7Count += 1;
      }
      if (diffDays <= 30) {
        last30Revenue += o.total;
        last30Count += 1;
      }
      const city = (o.customer && o.customer.city) || "Unknown";
      byCity[city] = (byCity[city] || 0) + o.total;
    });
    const topCities = Object.entries(byCity)
      .map(([city, revenue]) => ({ city, revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
    const totalRevenueAll = orders.reduce((sum, o) => sum + o.total, 0);
    const shareOfOrders = !orders.length ? 0 : (allCount / orders.length) * 100;
    const shareOfRevenue = !totalRevenueAll
      ? 0
      : (allRevenue / totalRevenueAll) * 100;
    return {
      last7: { count: last7Count, revenue: last7Revenue },
      last30: { count: last30Count, revenue: last30Revenue },
      all: { count: allCount, revenue: allRevenue },
      shareOfOrders,
      shareOfRevenue,
      topCities,
    };
  }, [orders]);

  const analytics = useMemo(() => {
    const byCategory = {};
    const productMap = {};
    const b2bOrders = orders.filter((o) => o.status === "CONFIRMED_B2B");
    b2bOrders.forEach((o) => {
      o.items.forEach((it) => {
        const cat = it.product.category;
        const key = it.product.id;
        byCategory[cat] = (byCategory[cat] || 0) + it.quantity;
        if (!productMap[key]) {
          productMap[key] = { product: it.product, quantity: 0 };
        }
        productMap[key].quantity += it.quantity;
      });
    });
    const byCategoryArray = Object.entries(byCategory)
      .map(([category, quantity]) => ({ category, quantity }))
      .sort((a, b) => b.quantity - a.quantity);
    const topProducts = Object.values(productMap)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 3);
    return { byCategoryArray, topProducts };
  }, [orders]);

  const getBusinessPrice = (p) => (p ? p.price * 0.9 : 0);

  const b2bTotal = useMemo(() => {
    return b2bItems.reduce((sum, it) => {
      const p = products.find((pr) => pr.id === it.productId);
      if (!p) return sum;
      return sum + getBusinessPrice(p) * it.quantity;
    }, 0);
  }, [b2bItems, products]);

  const handleToggleStock = async (productId, current) => {
    try {
      const updated = await updateProductStock(productId, !current);
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, in_stock: updated.in_stock } : p))
      );
    } catch (e) {
      console.error(e);
      alert("Failed to update stock (demo)");
    }
  };

  const addB2bItem = () => {
    if (!b2bProductId || b2bQty <= 0) return;
    setB2bItems((prev) => {
      const existing = prev.find((it) => it.productId === Number(b2bProductId));
      if (existing) {
        return prev.map((it) =>
          it.productId === Number(b2bProductId)
            ? { ...it, quantity: it.quantity + b2bQty }
            : it
        );
      }
      return [...prev, { productId: Number(b2bProductId), quantity: b2bQty }];
    });
    setB2bStatus("");
  };

  const removeB2bItem = (productId) => {
    setB2bItems((prev) => prev.filter((it) => it.productId !== productId));
  };

  const submitB2bOrder = async () => {
    if (!b2bItems.length) return;
    const customer = {
      full_name: user ? `${user.name} (Business)` : "Demo Business Customer",
      email: "b2b@example.com",
      phone: "0000000000",
      address_line1: "Demo Business Park",
      address_line2: "",
      city: "Bengaluru",
      postal_code: "560001",
      country: "India",
    };
    const payload = {
      items: b2bItems.map((it) => ({ product_id: it.productId, quantity: it.quantity })),
      customer,
      payment_method: "B2B_INVOICE",
    };
    try {
      setB2bSubmitting(true);
      setB2bStatus("");
      const res = await createSellerOrder(payload);
      setOrders((prev) => [...prev, res.order]);
      setB2bItems([]);
      setB2bStatus(`Created business order ${res.order_id}`);
    } catch (e) {
      console.error(e);
      setB2bStatus("Failed to create business order (demo)");
    } finally {
      setB2bSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <h1 style={{ fontSize: "1.4rem", marginBottom: 4 }}>Seller / B2B Dashboard</h1>
      <p style={{ fontSize: "0.9rem", marginBottom: 12 }}>
        This is a demo seller account view. It uses the same mock orders from the
        customer side to give you a quick business overview.
      </p>

      {loading && <div>Loading...</div>}
      {error && <div style={{ color: "#b91c1c" }}>{error}</div>}

      <div
        style={{
          marginTop: 8,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "0.75rem",
        }}
      >
        <div className="card">
          <h2 style={{ fontSize: "1rem", marginTop: 0 }}>Business summary</h2>
          <p style={{ fontSize: "0.85rem" }}>
            Overall orders: <strong>{stats.totalOrders}</strong>
            <br />
            Overall revenue: <strong>₹{stats.totalRevenue.toFixed(2)}</strong>
            <br />
            Last order at: <strong>{stats.lastOrderAt}</strong>
            <br />
            Avg order value: <strong>₹{stats.avgOrderValue.toFixed(2)}</strong>
            <br />
            <br />
            <strong>B2B analytics</strong>
            <br />
            B2B orders: <strong>{b2bStats.totalOrders}</strong>
            <br />
            B2B revenue: <strong>₹{b2bStats.totalRevenue.toFixed(2)}</strong>
            <br />
            B2B avg order value: <strong>₹{b2bStats.avgOrderValue.toFixed(2)}</strong>
            <br />
            <br />
            Last 7 days B2B: <strong>{b2bAdvanced.last7.count}</strong> orders ·{" "}
            <strong>₹{b2bAdvanced.last7.revenue.toFixed(2)}</strong> revenue
            <br />
            Last 30 days B2B: <strong>{b2bAdvanced.last30.count}</strong> orders ·{" "}
            <strong>₹{b2bAdvanced.last30.revenue.toFixed(2)}</strong> revenue
            <br />
            B2B share of orders:{" "}
            <strong>{b2bAdvanced.shareOfOrders.toFixed(1)}%</strong>
            <br />
            B2B share of revenue:{" "}
            <strong>{b2bAdvanced.shareOfRevenue.toFixed(1)}%</strong>
          </p>
        </div>

        <div className="card">
          <h2 style={{ fontSize: "1rem", marginTop: 0 }}>Business orders</h2>
          <p style={{ fontSize: "0.85rem" }}>
            View all demo orders that your business has fulfilled in this
            environment.
          </p>
          <button
            type="button"
            onClick={() => navigate("/orders")}
            style={{
              marginTop: 6,
              padding: "0.35rem 0.7rem",
              borderRadius: 4,
              border: "none",
              background: "#f97316",
              color: "white",
              fontSize: "0.85rem",
              cursor: "pointer",
            }}
          >
            View all orders
          </button>
        </div>

        <div className="card">
          <h2 style={{ fontSize: "1rem", marginTop: 0 }}>Catalog &amp; pricing</h2>
          <p style={{ fontSize: "0.85rem" }}>
            Manage your demo catalog and bulk pricing by exploring the products
            page and adjusting filters.
          </p>
          <button
            type="button"
            onClick={() => navigate("/products")}
            style={{
              marginTop: 6,
              padding: "0.35rem 0.7rem",
              borderRadius: 4,
              border: "1px solid #e5e7eb",
              background: "#f9fafb",
              fontSize: "0.85rem",
              cursor: "pointer",
            }}
          >
            Go to catalog
          </button>
        </div>

        <div className="card">
          <h2 style={{ fontSize: "1rem", marginTop: 0 }}>Buyer experience</h2>
          <p style={{ fontSize: "0.85rem" }}>
            Switch back to the shopper view to place new demo orders and see how
            they show up here as B2B volume.
          </p>
          <button
            type="button"
            onClick={() => navigate("/")}
            style={{
              marginTop: 6,
              padding: "0.35rem 0.7rem",
              borderRadius: 4,
              border: "1px solid #e5e7eb",
              background: "#ffffff",
              fontSize: "0.85rem",
              cursor: "pointer",
            }}
          >
            Back to shopping
          </button>
        </div>
      </div>

      {catalogError && (
        <div style={{ color: "#b91c1c", marginTop: 8 }}>{catalogError}</div>
      )}

      <section style={{ marginTop: 16 }}>
        <h2 style={{ fontSize: "1.1rem", marginBottom: 6 }}>My catalog (demo)</h2>
        <div className="card" style={{ overflowX: "auto" }}>
          {catalogLoading ? (
            <div>Loading catalog...</div>
          ) : !products.length ? (
            <div>No products found.</div>
          ) : (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.8rem",
              }}
            >
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "0.3rem" }}>Product</th>
                  <th style={{ textAlign: "left", padding: "0.3rem" }}>Category</th>
                  <th style={{ textAlign: "right", padding: "0.3rem" }}>Price</th>
                  <th style={{ textAlign: "right", padding: "0.3rem" }}>Business price</th>
                  <th style={{ textAlign: "center", padding: "0.3rem" }}>Stock</th>
                  <th style={{ textAlign: "center", padding: "0.3rem" }}>Toggle</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td style={{ padding: "0.3rem" }}>{p.title}</td>
                    <td style={{ padding: "0.3rem" }}>{p.category}</td>
                    <td style={{ padding: "0.3rem", textAlign: "right" }}>
                      ₹{p.price.toFixed(2)}
                    </td>
                    <td style={{ padding: "0.3rem", textAlign: "right" }}>
                      ₹{getBusinessPrice(p).toFixed(2)}
                    </td>
                    <td style={{ padding: "0.3rem", textAlign: "center" }}>
                      <span
                        style={{
                          color: p.in_stock ? "#16a34a" : "#b91c1c",
                          fontWeight: 600,
                        }}
                      >
                        {p.in_stock ? "In stock" : "Out"}
                      </span>
                    </td>
                    <td style={{ padding: "0.3rem", textAlign: "center" }}>
                      <button
                        type="button"
                        onClick={() => handleToggleStock(p.id, p.in_stock)}
                        style={{
                          padding: "0.25rem 0.5rem",
                          borderRadius: 9999,
                          border: "1px solid #e5e7eb",
                          background: "#f9fafb",
                          cursor: "pointer",
                        }}
                      >
                        {p.in_stock ? "Mark out" : "Mark in"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <section
        style={{
          marginTop: 16,
          display: "grid",
          gridTemplateColumns: "minmax(0,1.2fr) minmax(0,1fr)",
          gap: "0.75rem",
        }}
      >
        <div className="card">
          <h2 style={{ fontSize: "1rem", marginTop: 0 }}>B2B orders by category</h2>
          {analytics.byCategoryArray.length === 0 ? (
            <p style={{ fontSize: "0.85rem" }}>No orders yet.</p>
          ) : (
            <ul style={{ margin: 0, paddingLeft: "1.1rem", fontSize: "0.85rem" }}>
              {analytics.byCategoryArray.map((row) => (
                <li key={row.category}>
                  {row.category}: <strong>{row.quantity}</strong> units sold
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card">
          <h2 style={{ fontSize: "1rem", marginTop: 0 }}>Top B2B products</h2>
          {analytics.topProducts.length === 0 ? (
            <p style={{ fontSize: "0.85rem" }}>No orders yet.</p>
          ) : (
            <ul style={{ margin: 0, paddingLeft: "1.1rem", fontSize: "0.85rem" }}>
              {analytics.topProducts.map((row) => (
                <li key={row.product.id}>
                  {row.product.title} – <strong>{row.quantity}</strong> units
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section style={{ marginTop: 16 }}>
        <h2 style={{ fontSize: "1.1rem", marginBottom: 6 }}>Create B2B / bulk order</h2>
        <div className="card">
          <p style={{ fontSize: "0.85rem" }}>
            Build a demo business order by selecting products and quantities. This
            will call the B2B order API and add a new order with status
            <strong> CONFIRMED_B2B</strong>.
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
              alignItems: "center",
              marginTop: 8,
            }}
          >
            <select
              value={b2bProductId}
              onChange={(e) => setB2bProductId(e.target.value)}
              style={{ padding: "0.35rem 0.45rem", fontSize: "0.85rem" }}
            >
              <option value="">Select product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              value={b2bQty}
              onChange={(e) => setB2bQty(Number(e.target.value) || 1)}
              style={{
                width: 80,
                padding: "0.35rem 0.45rem",
                fontSize: "0.85rem",
              }}
            />
            <button
              type="button"
              onClick={addB2bItem}
              style={{
                padding: "0.35rem 0.7rem",
                borderRadius: 4,
                border: "1px solid #e5e7eb",
                background: "#f9fafb",
                fontSize: "0.85rem",
                cursor: "pointer",
              }}
            >
              Add item
            </button>
          </div>

          {b2bItems.length > 0 && (
            <div style={{ marginTop: 10, fontSize: "0.85rem" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.35rem",
                  marginBottom: 6,
                }}
              >
                {b2bItems.map((it) => {
                  const p = products.find((pr) => pr.id === it.productId);
                  if (!p) return null;
                  const bp = getBusinessPrice(p);
                  return (
                    <div
                      key={it.productId}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 500 }}>{p.title}</div>
                        <div>
                          Qty {it.quantity} × ₹{bp.toFixed(2)} (business)
                        </div>
                      </div>
                      <div>
                        <span style={{ marginRight: 8 }}>
                          ₹{(bp * it.quantity).toFixed(2)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeB2bItem(it.productId)}
                          style={{
                            padding: "0.2rem 0.45rem",
                            borderRadius: 9999,
                            border: "1px solid #e5e7eb",
                            background: "#ffffff",
                            cursor: "pointer",
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ fontWeight: 600 }}>
                B2B order total: ₹{b2bTotal.toFixed(2)}
              </div>
            </div>
          )}

          <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8 }}>
            <button
              type="button"
              disabled={!b2bItems.length || b2bSubmitting}
              onClick={submitB2bOrder}
              style={{
                padding: "0.45rem 0.9rem",
                borderRadius: 4,
                border: "none",
                background: "#16a34a",
                color: "white",
                fontSize: "0.9rem",
                cursor: b2bItems.length && !b2bSubmitting ? "pointer" : "default",
                opacity: b2bItems.length && !b2bSubmitting ? 1 : 0.6,
              }}
            >
              {b2bSubmitting ? "Creating order..." : "Create B2B order"}
            </button>
            {b2bStatus && (
              <span style={{ fontSize: "0.8rem" }}>{b2bStatus}</span>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default SellerDashboardPage;
