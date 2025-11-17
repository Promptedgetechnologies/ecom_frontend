import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const banners = [
  {
    id: 1,
    title: "Mega Electronics Sale",
    subtitle: "Up to 50% off on TVs, laptops & more",
    bg: "linear-gradient(120deg,rgba(15,23,42,0.15),rgba(15,23,42,0.8))",
    imageUrl:
      "https://images.pexels.com/photos/374870/pexels-photo-374870.jpeg?auto=compress&cs=tinysrgb&w=1200",
    targetCategory: "Electronics",
  },
  {
    id: 2,
    title: "Fashion Fiesta",
    subtitle: "Trending styles at hot prices",
    bg: "linear-gradient(120deg,rgba(15,23,42,0.1),rgba(15,23,42,0.85))",
    imageUrl:
      "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg?auto=compress&cs=tinysrgb&w=1200",
    targetCategory: "Fashion",
  },
  {
    id: 3,
    title: "Home & Kitchen Upgrade",
    subtitle: "Cookware, bedsheets & more",
    bg: "linear-gradient(120deg,rgba(15,23,42,0.1),rgba(15,23,42,0.85))",
    imageUrl:
      "https://images.pexels.com/photos/3735410/pexels-photo-3735410.jpeg?auto=compress&cs=tinysrgb&w=1200",
    targetCategory: "Home & Kitchen",
  },
  {
    id: 4,
    title: "Smartphones & Gadgets",
    subtitle: "Latest mobiles, smartwatches and more",
    bg: "linear-gradient(120deg,rgba(15,23,42,0.2),rgba(8,47,73,0.9))",
    imageUrl:
      "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=1200",
    targetCategory: "Mobiles",
  },
  {
    id: 5,
    title: "Books & Learning Essentials",
    subtitle: "Bestsellers, exam prep and more",
    bg: "linear-gradient(120deg,rgba(15,23,42,0.18),rgba(67,56,202,0.9))",
    imageUrl:
      "https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg?auto=compress&cs=tinysrgb&w=1200",
    targetCategory: "Books",
  },
  {
    id: 6,
    title: "Big Savings Week",
    subtitle: "Extra offers across multiple categories",
    bg: "linear-gradient(120deg,rgba(15,23,42,0.15),rgba(180,83,9,0.9))",
    imageUrl:
      "https://images.pexels.com/photos/5632405/pexels-photo-5632405.jpeg?auto=compress&cs=tinysrgb&w=1200",
    targetCategory: "Electronics",
  },
];

function BannerCarousel() {
  const [idx, setIdx] = useState(0);
  const [fadeOpacity, setFadeOpacity] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % banners.length), 5000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    setFadeOpacity(1);
    const t = setTimeout(() => setFadeOpacity(0), 400);
    return () => clearTimeout(t);
  }, [idx]);
  const goPrev = () => {
    setIdx((i) => (i - 1 + banners.length) % banners.length);
  };

  const goNext = () => {
    setIdx((i) => (i + 1) % banners.length);
  };

  return (
    <section style={{ marginBottom: "1.5rem" }}>
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: "16px",
          boxShadow: "0 18px 40px rgba(15,23,42,0.45)",
        }}
      >
        <div
          style={{
            display: "flex",
            width: `${banners.length * 100}%`,
            transform: `translateX(-${idx * (100 / banners.length)}%)`,
            transition:
              "transform 800ms cubic-bezier(0.22, 0.61, 0.36, 1)",
          }}
        >
          {banners.map((b) => (
            <div
              key={b.id}
              style={{
                flex: `0 0 ${100 / banners.length}%`,
                padding: "1.75rem 1.75rem 1.25rem",
                color: "white",
                minHeight: "180px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                backgroundImage: `${b.bg}, url(${b.imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundBlendMode: "overlay",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1.5rem",
                }}
              >
                <div style={{ maxWidth: 520 }}>
                  <h1
                    style={{
                      fontSize: "1.8rem",
                      marginBottom: "0.35rem",
                      fontWeight: 700,
                    }}
                  >
                    {b.title}
                  </h1>
                  <p style={{ fontSize: "0.95rem", opacity: 0.9 }}>
                    {b.subtitle}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        b.targetCategory
                          ? `/products?category=${encodeURIComponent(
                              b.targetCategory
                            )}`
                          : "/products"
                      )
                    }
                    style={{
                      marginTop: "0.9rem",
                      padding: "0.55rem 1.1rem",
                      borderRadius: 9999,
                      border: "none",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      backgroundColor: "rgba(15,23,42,0.9)",
                      color: "#fbbf24",
                      boxShadow: "0 10px 25px rgba(15,23,42,0.4)",
                      cursor: "pointer",
                    }}
                  >
                    View top deals
                  </button>
                </div>
                <div
                  style={{
                    flex: "0 0 220px",
                    height: "130px",
                    borderRadius: 18,
                    background:
                      "radial-gradient(circle at 0% 0%, rgba(248,250,252,0.35), transparent 55%), rgba(15,23,42,0.4)",
                    border: "1px solid rgba(248,250,252,0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.8rem",
                    textAlign: "center",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "0.75rem", opacity: 0.9 }}>
                      Today only
                    </div>
                    <div style={{ fontSize: "1.4rem", fontWeight: 700 }}>
                      Big Savings
                    </div>
                    <div style={{ fontSize: "0.8rem", opacity: 0.9 }}>
                      Extra offers on select products
                    </div>
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  marginTop: "0.8rem",
                  fontSize: "0.75rem",
                  opacity: 0.85,
                }}
              >
                <div style={{ display: "flex", gap: "0.35rem" }}>
                  {banners.map((banner, i) => (
                    <span
                      key={banner.id}
                      style={{
                        width: i === idx ? 14 : 8,
                        height: 8,
                        borderRadius: 9999,
                        backgroundColor:
                          i === idx
                            ? "rgba(248,250,252,0.95)"
                            : "rgba(248,250,252,0.4)",
                        transition: "all 200ms ease-out",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 0% 0%, rgba(15,23,42,0.25), transparent 55%), rgba(15,23,42,0.65)",
            opacity: fadeOpacity,
            pointerEvents: "none",
            transition: "opacity 400ms ease-out",
          }}
        />

        <button
          type="button"
          onClick={goPrev}
          style={{
            position: "absolute",
            top: "50%",
            left: 10,
            transform: "translateY(-50%)",
            borderRadius: "9999px",
            border: "none",
            width: 30,
            height: 30,
            backgroundColor: "rgba(15,23,42,0.6)",
            color: "white",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {"<"}
        </button>
        <button
          type="button"
          onClick={goNext}
          style={{
            position: "absolute",
            top: "50%",
            right: 10,
            transform: "translateY(-50%)",
            borderRadius: "9999px",
            border: "none",
            width: 30,
            height: 30,
            backgroundColor: "rgba(15,23,42,0.6)",
            color: "white",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {">"}
        </button>
      </div>
    </section>
  );
}

export default BannerCarousel;
