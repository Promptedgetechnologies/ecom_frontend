import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import BannerCarousel from "../components/BannerCarousel";
import { fetchProducts, fetchCategories } from "../api";
import { useCartWishlist } from "../context/CartWishlistContext";

function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(true);
  const { addToCart, addToWishlist } = useCartWishlist();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [p, c] = await Promise.all([
          fetchProducts(),
          fetchCategories(),
        ]);
        setProducts(p.products);
        setCategories(c.categories);
      } catch (e) {
        console.error(e);
        setError("Failed to load home page");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const todaysDeals = products.filter((p) => p.is_today_deal);
  const upcoming = products.filter((p) => p.is_upcoming);
  const discountZone = products.filter((p) => p.discount_percentage >= 35);

   const promoBanners = [
    {
      id: 1,
      title: "Bank Offers",
      subtitle: "10% instant discount with demo bank cards",
      tone: "warm",
    },
    {
      id: 2,
      title: "Free Delivery",
      subtitle: "On orders above ₹499 · Demo only",
      tone: "cool",
    },
    {
      id: 3,
      title: "Exchange & Buy",
      subtitle: "Save more by exchanging old devices",
      tone: "neutral",
    },
    {
      id: 4,
      title: "Prime-like Benefits",
      subtitle: "Early access to upcoming offers",
      tone: "accent",
    },
  ];

  return (
    <div className="page-container">
      <BannerCarousel />
      <section className="home-hero-and-tiles">
        <div className="home-hero">
          <div className="home-hero-text">
            <div className="home-hero-kicker">Holiday gift guide · Demo</div>
            <h1 className="home-hero-title">Shop holiday gift guides</h1>
            <p className="home-hero-subtitle">
              Discover curated picks by price, recipient and more. All prices
              and orders are mock data for this demo.
            </p>
            <button
              type="button"
              className="home-hero-cta"
              onClick={() =>
                window.scrollTo({ top: 600, behavior: "smooth" })
              }
            >
              Explore all gift picks
            </button>
          </div>
          <div className="home-hero-art" />
        </div>

        {!loading && products.length > 0 && (
          <div className="home-gift-tiles">
            <div className="home-gift-card">
              <h2 className="home-gift-card-title">Shop gifts by price</h2>
              <div className="home-gift-card-grid">
                {products.slice(0, 4).map((p) => (
                  <img
                    key={p.id}
                    src={p.image_url}
                    alt={p.title}
                    className="home-gift-thumb"
                  />
                ))}
              </div>
              <span className="home-gift-card-link">See more price picks</span>
            </div>

            <div className="home-gift-card">
              <h2 className="home-gift-card-title">Shop gifts by category</h2>
              <div className="home-gift-card-grid">
                {products
                  .filter((p) =>
                    ["Electronics", "Mobiles", "Fashion", "Books"].includes(
                      p.category
                    )
                  )
                  .slice(0, 4)
                  .map((p) => (
                    <img
                      key={p.id}
                      src={p.image_url}
                      alt={p.title}
                      className="home-gift-thumb"
                    />
                  ))}
              </div>
              <span className="home-gift-card-link">Browse by category</span>
            </div>

            <div className="home-gift-card">
              <h2 className="home-gift-card-title">For your home</h2>
              <div className="home-gift-card-grid">
                {products
                  .filter((p) =>
                    ["Home & Kitchen", "Furniture"].includes(p.category)
                  )
                  .slice(0, 4)
                  .map((p) => (
                    <img
                      key={p.id}
                      src={p.image_url}
                      alt={p.title}
                      className="home-gift-thumb"
                    />
                  ))}
              </div>
              <span className="home-gift-card-link">Shop home essentials</span>
            </div>

            <div className="home-gift-card">
              <h2 className="home-gift-card-title">Refresh your space</h2>
              <div className="home-gift-card-grid">
                {discountZone.slice(0, 4).map((p) => (
                  <img
                    key={p.id}
                    src={p.image_url}
                    alt={p.title}
                    className="home-gift-thumb"
                  />
                ))}
              </div>
              <span className="home-gift-card-link">See all refresh ideas</span>
            </div>
          </div>
        )}
      </section>
      <div className="home-announcement">
        <span className="home-announcement-pill">New</span>
        <span className="home-announcement-text">
         There is new offers available from next week
        </span>
      </div>

      <div className="home-promo-strip">
        {promoBanners.map((b) => (
          <div
            key={b.id}
            className={"home-promo-card home-promo-card-" + b.tone}
          >
            <div className="home-promo-title">{b.title}</div>
            <div className="home-promo-subtitle">{b.subtitle}</div>
          </div>
        ))}
      </div>

      {showPopup && (
        <div className="home-popup-overlay">
          <div className="home-popup">
            <div className="home-popup-header">
              <span className="home-popup-badge">Welcome</span>
              <button
                type="button"
                className="home-popup-close"
                onClick={() => setShowPopup(false)}
              >
                ×
              </button>
            </div>
            <h2 className="home-popup-title">Kickstart your shopping tour</h2>
            <p className="home-popup-body">
              Explore today's deals, upcoming offers and category-wise carousels.
              This popup is only for demo and does not affect any real orders.
            </p>
            <button
              type="button"
              className="home-popup-cta"
              onClick={() => setShowPopup(false)}
            >
              Start exploring
            </button>
          </div>
        </div>
      )}
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: "#b91c1c" }}>{error}</div>}

      {!loading && (
        <>
          <section>
            <div className="section-header">
              <h2>Today's Deals</h2>
              <span>Limited-time offers</span>
            </div>
            <div className="horizontal-scroll">
              {todaysDeals.map((p) => (
                <div key={p.id} style={{ minWidth: 190, maxWidth: 200 }}>
                  <ProductCard
                    product={p}
                    onAddToCart={addToCart}
                    onAddToWishlist={addToWishlist}
                  />
                </div>
              ))}
              {todaysDeals.length === 0 && <div>No deals today.</div>}
            </div>
          </section>

          <section>
            <div className="section-header">
              <h2>Upcoming Offers</h2>
              <span>Coming soon</span>
            </div>
            <div className="horizontal-scroll">
              {upcoming.map((p) => (
                <div key={p.id} style={{ minWidth: 190, maxWidth: 200 }}>
                  <ProductCard
                    product={p}
                    onAddToCart={addToCart}
                    onAddToWishlist={addToWishlist}
                  />
                </div>
              ))}
              {upcoming.length === 0 && <div>No upcoming offers.</div>}
            </div>
          </section>

          <section>
            <div className="section-header">
              <h2>Discount Zone</h2>
              <span>Biggest savings</span>
            </div>
            <div className="horizontal-scroll">
              {discountZone.map((p) => (
                <div key={p.id} style={{ minWidth: 190, maxWidth: 200 }}>
                  <ProductCard
                    product={p}
                    onAddToCart={addToCart}
                    onAddToWishlist={addToWishlist}
                  />
                </div>
              ))}
              {discountZone.length === 0 && <div>No heavy discounts.</div>}
            </div>
          </section>

          {categories.map((cat) => {
            const items = products.filter((p) => p.category === cat.name);
            if (!items.length) return null;
            return (
              <section key={cat.name}>
                <div className="section-header">
                  <h2>{cat.name}</h2>
                  <span>Category picks</span>
                </div>
                <div className="horizontal-scroll">
                  {items.map((p) => (
                    <div key={p.id} style={{ minWidth: 190, maxWidth: 200 }}>
                      <ProductCard
                        product={p}
                        onAddToCart={addToCart}
                        onAddToWishlist={addToWishlist}
                      />
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </>
      )}
    </div>
  );
}

export default HomePage;
