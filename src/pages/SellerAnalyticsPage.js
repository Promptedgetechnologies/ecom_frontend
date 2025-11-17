import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { fetchOrders } from "../api";

const PIE_COLORS = ["#2563eb", "#16a34a", "#f97316", "#a855f7", "#ec4899"];

function B2BGauge({ share }) {
  const safe = Number.isFinite(share) ? share : 0;
  const clamped = Math.max(0, Math.min(100, safe));
  const angle = (clamped / 100) * 360;

  const outerStyle = {
    width: 140,
    height: 140,
    borderRadius: "9999px",
    background: `conic-gradient(#16a34a 0deg ${angle}deg, #e5e7eb ${angle}deg 360deg)`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 8px",
  };

  const innerStyle = {
    width: 96,
    height: 96,
    borderRadius: "9999px",
    background: "#ffffff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 0 0 1px #e5e7eb",
  };

  return (
    <div style={{ textAlign: "center", fontSize: "0.85rem" }}>
      <div style={outerStyle}>
        <div style={innerStyle}>
          <div style={{ fontSize: "1.2rem", fontWeight: 700 }}>
            {clamped.toFixed(1)}%
          </div>
          <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>B2B revenue</div>
        </div>
      </div>
      <div style={{ color: "#4b5563" }}>Share of total business revenue</div>
    </div>
  );
}

function SellerAnalyticsPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await fetchOrders();
        setOrders(data || []);
      } catch (e) {
        console.error(e);
        setError("Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const analytics = useMemo(() => {
    const b2bOrders = orders.filter((o) => o.status === "CONFIRMED_B2B");
    const totalOrdersAll = orders.length;
    const totalRevenueAll = orders.reduce((sum, o) => sum + (o.total || 0), 0);

    let b2bOrderCount = 0;
    let b2bRevenue = 0;
    const byCategory = {};

    b2bOrders.forEach((o) => {
      b2bOrderCount += 1;
      b2bRevenue += o.total || 0;
      (o.items || []).forEach((it) => {
        const cat = it.product?.category || "Other";
        if (!byCategory[cat]) {
          byCategory[cat] = { category: cat, units: 0, revenue: 0 };
        }
        const units = it.quantity || 0;
        const lineRevenue =
          typeof it.item_total === "number"
            ? it.item_total
            : (it.product?.price || 0) * units;
        byCategory[cat].units += units;
        byCategory[cat].revenue += lineRevenue;
      });
    });

    const byCategoryArray = Object.values(byCategory)
      .map((row) => row)
      .sort((a, b) => b.units - a.units);

    const shareOfOrders = !totalOrdersAll
      ? 0
      : (b2bOrderCount / totalOrdersAll) * 100;
    const shareOfRevenue = !totalRevenueAll
      ? 0
      : (b2bRevenue / totalRevenueAll) * 100;

    return {
      b2bOrderCount,
      b2bRevenue,
      totalOrdersAll,
      totalRevenueAll,
      byCategoryArray,
      shareOfOrders,
      shareOfRevenue,
    };
  }, [orders]);

  const barData = (analytics.byCategoryArray || []).map((row) => ({
    category: row.category,
    units: row.units,
  }));

  const pieData = (analytics.byCategoryArray || []).map((row) => ({
    name: row.category,
    value: row.revenue,
  }));

  const hasB2B = analytics.b2bOrderCount > 0;

  return (
    <div className="page-container">
      <h1 style={{ fontSize: "1.4rem", marginBottom: 4 }}>Seller B2B Analytics</h1>
      <p style={{ fontSize: "0.9rem", marginBottom: 12 }}>
        Visual analytics for your B2B orders. This dashboard uses only orders with
        status <strong>CONFIRMED_B2B</strong> to show how business buyers are
        interacting with your catalog.
      </p>

      <div style={{ marginBottom: 12 }}>
        <button
          type="button"
          onClick={() => navigate("/seller")}
          style={{
            padding: "0.35rem 0.7rem",
            borderRadius: 4,
            border: "1px solid #e5e7eb",
            background: "#f9fafb",
            fontSize: "0.85rem",
            cursor: "pointer",
          }}
        >
          Back to seller dashboard
        </button>
      </div>

      {loading && <div>Loading analytics...</div>}
      {error && <div style={{ color: "#b91c1c" }}>{error}</div>}

      {!loading && !error && !hasB2B && (
        <div className="card" style={{ marginTop: 8 }}>
          <p style={{ margin: 0, fontSize: "0.9rem" }}>
            No B2B orders yet. Create a B2B / bulk order from the seller dashboard to
            see analytics here.
          </p>
        </div>
      )}

      {!loading && !error && hasB2B && (
        <>
          <section style={{ marginTop: 8 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "0.75rem",
              }}
            >
              <div className="card">
                <h2 style={{ fontSize: "1rem", marginTop: 0 }}>B2B summary</h2>
                <p style={{ fontSize: "0.85rem" }}>
                  Total B2B orders: <strong>{analytics.b2bOrderCount}</strong>
                  <br />
                  Total B2B revenue: <strong>₹{analytics.b2bRevenue.toFixed(2)}</strong>
                  <br />
                  Overall orders: <strong>{analytics.totalOrdersAll}</strong>
                  <br />
                  Overall revenue: <strong>₹{analytics.totalRevenueAll.toFixed(2)}</strong>
                </p>
              </div>

              <div className="card">
                <h2 style={{ fontSize: "1rem", marginTop: 0 }}>B2B revenue share</h2>
                <div style={{ marginTop: 4 }}>
                  <B2BGauge share={analytics.shareOfRevenue} />
                </div>
                <p style={{ fontSize: "0.8rem", marginTop: 4 }}>
                  B2B revenue is approximately
                  {" "}
                  <strong>{analytics.shareOfRevenue.toFixed(1)}%</strong>
                  {" "}
                  of your overall business revenue.
                </p>
              </div>

              <div className="card">
                <h2 style={{ fontSize: "1rem", marginTop: 0 }}>Units by category</h2>
                {barData.length === 0 ? (
                  <p style={{ fontSize: "0.85rem" }}>No item-level data available.</p>
                ) : (
                  <div style={{ width: "100%", height: 220 }}>
                    <ResponsiveContainer>
                      <BarChart data={barData} margin={{ top: 8, right: 8, left: 0, bottom: 16 }}>
                        <XAxis dataKey="category" angle={-20} textAnchor="end" height={50} />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="units" fill="#2563eb" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              <div className="card">
                <h2 style={{ fontSize: "1rem", marginTop: 0 }}>Revenue by category</h2>
                {pieData.length === 0 ? (
                  <p style={{ fontSize: "0.85rem" }}>No item-level data available.</p>
                ) : (
                  <div style={{ width: "100%", height: 240 }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          nameKey="name"
                          outerRadius={80}
                          label
                        >
                          {pieData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={PIE_COLORS[index % PIE_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default SellerAnalyticsPage;
