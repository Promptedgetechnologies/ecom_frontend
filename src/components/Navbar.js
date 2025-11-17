import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useCartWishlist } from "../context/CartWishlistContext";
import { useUser } from "../context/UserContext";
import { useB2B } from "../context/B2BContext";
import { fetchOrders } from "../api";

function Navbar() {
  const { cartCount, wishlistCount } = useCartWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const { b2bMode, toggleB2BMode } = useB2B();

  const [searchText, setSearchText] = useState("");
  const [searchCategory, setSearchCategory] = useState("all");
  const [b2bCount, setB2bCount] = useState(0);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    const trimmed = searchText.trim();
    if (trimmed) params.set("q", trimmed);
    if (searchCategory && searchCategory !== "all") {
      params.set("category", searchCategory);
    }
    const query = params.toString();
    navigate(`/products${query ? `?${query}` : ""}`);
  };

  const goToSignIn = () => {
    navigate("/signin", { state: { from: location.pathname } });
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchOrders();
        const count = (data || []).filter(
          (o) => o.status === "CONFIRMED_B2B"
        ).length;
        setB2bCount(count);
      } catch (e) {
        console.error("Failed to load B2B orders count", e);
      }
    })();
  }, []);

  return (
    <header className="navbar">
      <div className="navbar-top">
        <div className="navbar-left">
          <div className="navbar-logo" onClick={() => navigate("/")}>
            PromptEdge
          </div>
          <div className="navbar-location">
            <span className="navbar-location-label">Deliver to</span>
            <span className="navbar-location-value">India</span>
          </div>
        </div>

        <form className="navbar-search" onSubmit={handleSearchSubmit}>
          <select
            className="navbar-search-category"
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
          >
            <option value="all">All</option>
            <option value="Electronics">Electronics</option>
            <option value="Mobiles">Mobiles</option>
            <option value="Fashion">Fashion</option>
            <option value="Home & Kitchen">Home &amp; Kitchen</option>
          </select>
          <input
            className="navbar-search-input"
            placeholder="Search PromptEdge"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button type="submit" className="navbar-search-button">
            🔍
          </button>
        </form>

        <div className="navbar-right">
          <button type="button" className="navbar-region">
            EN
          </button>
          <div className="navbar-account-container">
            <button
              type="button"
              className="navbar-account"
              onClick={() => (user ? navigate("/account") : goToSignIn())}
            >
              <span className="navbar-account-line-small">
                {user ? `Hello, ${user.name.split(" ")[0]}` : "Hello, sign in"}
              </span>
              <span className="navbar-account-line-bold">Account &amp; Lists</span>
            </button>
            <div className="navbar-account-menu">
              {user ? (
                <>
                  <div className="navbar-account-menu-section">
                    <div className="navbar-account-menu-title">
                      Hello, {user.name.split(" ")[0]}
                    </div>
                    <button
                      type="button"
                      className="navbar-account-menu-link navbar-account-menu-link-primary"
                      onClick={() => navigate("/account")}
                    >
                      Your Account
                    </button>
                    <button
                      type="button"
                      className="navbar-account-menu-link"
                      onClick={() => navigate("/orders")}
                    >
                      Your Orders
                    </button>
                    <button
                      type="button"
                      className="navbar-account-menu-link"
                      onClick={() => navigate("/seller")}
                    >
                      Seller / B2B dashboard
                    </button>
                  </div>
                  <div className="navbar-account-menu-section">
                    <button
                      type="button"
                      className="navbar-account-menu-link"
                      onClick={() => navigate("/wishlist")}
                    >
                      Your Wishlist
                    </button>
                    <button
                      type="button"
                      className="navbar-account-menu-link"
                      onClick={() => navigate("/cart")}
                    >
                      Your Cart
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="navbar-account-menu-section">
                    <div className="navbar-account-menu-title">Welcome, Guest</div>
                    <button
                      type="button"
                      className="navbar-account-menu-link navbar-account-menu-link-primary"
                      onClick={goToSignIn}
                    >
                      Sign in
                    </button>
                  </div>
                  <div className="navbar-account-menu-section">
                    <button
                      type="button"
                      className="navbar-account-menu-link"
                      onClick={() => navigate("/orders")}
                    >
                      Your Orders (demo)
                    </button>
                    <button
                      type="button"
                      className="navbar-account-menu-link"
                      onClick={() => navigate("/wishlist")}
                    >
                      Your Wishlist
                    </button>
                    <button
                      type="button"
                      className="navbar-account-menu-link"
                      onClick={() => navigate("/seller")}
                    >
                      Seller / B2B dashboard (demo)
                    </button>
                  </div>
                </>
              )}
              <div className="navbar-account-menu-footer">
                Demo only – no real account data stored.
              </div>
            </div>
          </div>
          <button
            type="button"
            className="navbar-account"
            onClick={() => (user ? navigate("/orders") : goToSignIn())}
          >
            <span className="navbar-account-line-small">Returns</span>
            <span className="navbar-account-line-bold">&amp; Orders</span>
          </button>
          <button
            type="button"
            className="navbar-action"
            onClick={() => navigate("/wishlist")}
          >
            Wishlist
            <span className="navbar-badge">{wishlistCount}</span>
          </button>
          <button
            type="button"
            className="navbar-action navbar-action-primary"
            onClick={() => navigate("/cart")}
          >
            Cart
            <span className="navbar-badge">{cartCount}</span>
          </button>
        </div>
      </div>

      <div className="navbar-summary">
        <div className="navbar-summary-left">
          <span>
            {user ? `Hello, ${user.name.split(" ")[0]}` : "Hello, Guest"}
          </span>
          <span className="navbar-summary-dot">•</span>
          <span>{cartCount} item(s) in cart</span>
        </div>
        <div className="navbar-summary-right">
          <button
            type="button"
            className={
              "navbar-summary-toggle" + (b2bMode ? " navbar-summary-toggle-active" : "")
            }
            onClick={toggleB2BMode}
          >
            B2B mode
          </button>
          <span className="navbar-summary-pill">
            B2B orders: <strong>{b2bCount}</strong>
          </span>
        </div>
      </div>

      <div className="navbar-bottom">
        <nav className="navbar-links">
          <button type="button" className="navbar-menu-all">
            ☰ All
          </button>
          <NavLink
            to="/"
            className={({ isActive }) =>
              "navbar-link" + (isActive ? " navbar-link-active" : "")
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              "navbar-link" + (isActive ? " navbar-link-active" : "")
            }
          >
            Products
          </NavLink>
          <span className="navbar-link-static">Today's Deals</span>
          <span className="navbar-link-static">Customer Service</span>
          <span className="navbar-link-static">Gift Cards</span>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
