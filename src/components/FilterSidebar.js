import React from "react";

function FilterSidebar({
  categories,
  brands,
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  priceRange,
  setPriceRange,
  minRating,
  setMinRating,
  inStockOnly,
  setInStockOnly,
  sortBy,
  setSortBy,
}) {
  const changePrice = (e, i) => {
    const v = Number(e.target.value);
    const next = [...priceRange];
    next[i] = v;
    setPriceRange(next);
  };

  const resetFilters = () => {
    setSelectedCategory("");
    setSelectedBrand("");
    setPriceRange([0, 100000]);
    setMinRating(0);
    setInStockOnly(false);
    setSortBy("newest");
  };

  const activeCount =
    (selectedCategory ? 1 : 0) +
    (selectedBrand ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 100000 ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (sortBy !== "newest" ? 1 : 0);

  const applyQuickFilter = (key) => {
    if (key === "top_rated") {
      setMinRating(4);
      setSortBy("top_rated");
    } else if (key === "budget") {
      setPriceRange([0, 5000]);
      setSortBy("price_asc");
    } else if (key === "in_stock") {
      setInStockOnly(true);
    }
  };

  return (
    <aside
      className="card"
      style={{
        position: "sticky",
        top: 0,
        alignSelf: "flex-start",
        padding: "0.75rem 0.9rem 1rem",
        borderRadius: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 6,
        }}
      >
        <h3 style={{ fontSize: "1rem", margin: 0 }}>Filters</h3>
        <button
          type="button"
          onClick={resetFilters}
          disabled={activeCount === 0}
          style={{
            borderRadius: 9999,
            border: "1px solid #e5e7eb",
            padding: "0.15rem 0.5rem",
            fontSize: "0.75rem",
            background: activeCount === 0 ? "#f9fafb" : "#eff6ff",
            color: activeCount === 0 ? "#9ca3af" : "#1d4ed8",
            cursor: activeCount === 0 ? "default" : "pointer",
          }}
        >
          Clear
        </button>
      </div>
      {activeCount > 0 && (
        <div
          style={{
            fontSize: "0.75rem",
            marginBottom: 8,
            color: "#4b5563",
          }}
        >
          {activeCount} active filter{activeCount > 1 ? "s" : ""}
        </div>
      )}
      <div style={{ marginBottom: 12 }}>
        <div
          style={{
            fontSize: "0.8rem",
            fontWeight: 600,
            marginBottom: 4,
          }}
        >
          Quick filters
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.3rem",
          }}
        >
          <button
            type="button"
            onClick={() => applyQuickFilter("top_rated")}
            style={{
              borderRadius: 9999,
              padding: "0.15rem 0.55rem",
              border: "1px solid #e5e7eb",
              background: "#eff6ff",
              fontSize: "0.75rem",
              cursor: "pointer",
            }}
          >
            Top rated (4★+)
          </button>
          <button
            type="button"
            onClick={() => applyQuickFilter("budget")}
            style={{
              borderRadius: 9999,
              padding: "0.15rem 0.55rem",
              border: "1px solid #e5e7eb",
              background: "#fef3c7",
              fontSize: "0.75rem",
              cursor: "pointer",
            }}
          >
            Budget (≤ ₹5,000)
          </button>
          <button
            type="button"
            onClick={() => applyQuickFilter("in_stock")}
            style={{
              borderRadius: 9999,
              padding: "0.15rem 0.55rem",
              border: "1px solid #e5e7eb",
              background: "#ecfdf5",
              fontSize: "0.75rem",
              cursor: "pointer",
            }}
          >
            In stock only
          </button>
        </div>
      </div>
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>Category</div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{ width: "100%", marginTop: 4, padding: 4 }}
        >
          <option value="">All</option>
          {categories.map((c) => (
            <option key={c.name}>{c.name}</option>
          ))}
        </select>
      </div>
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>Brand</div>
        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          style={{ width: "100%", marginTop: 4, padding: 4 }}
        >
          <option value="">All</option>
          {brands.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>
      </div>
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>Price</div>
        <div style={{ fontSize: "0.8rem" }}>
          ₹{priceRange[0]} - ₹{priceRange[1]}
        </div>
        <input
          type="range"
          min="0"
          max="100000"
          step="500"
          value={priceRange[0]}
          onChange={(e) => changePrice(e, 0)}
        />
        <input
          type="range"
          min="0"
          max="100000"
          step="500"
          value={priceRange[1]}
          onChange={(e) => changePrice(e, 1)}
        />
      </div>
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>Min Rating</div>
        <select
          value={minRating}
          onChange={(e) => setMinRating(Number(e.target.value))}
          style={{ width: "100%", marginTop: 4, padding: 4 }}
        >
          <option value={0}>All</option>
          <option value={3}>3★+</option>
          <option value={3.5}>3.5★+</option>
          <option value={4}>4★+</option>
          <option value={4.5}>4.5★+</option>
        </select>
      </div>
      <div style={{ marginBottom: 10 }}>
        <label style={{ fontSize: "0.85rem" }}>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            style={{ marginRight: 4 }}
          />
          In stock only
        </label>
      </div>
      <div>
        <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>Sort By</div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{ width: "100%", marginTop: 4, padding: 4 }}
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="top_rated">Top Rated</option>
        </select>
      </div>
    </aside>
  );
}

export default FilterSidebar;
