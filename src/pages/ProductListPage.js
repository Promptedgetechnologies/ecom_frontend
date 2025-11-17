import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchProducts, fetchCategories } from "../api";
import ProductCard from "../components/ProductCard";
import FilterSidebar from "../components/FilterSidebar";
import { useCartWishlist } from "../context/CartWishlistContext";
import { useB2B } from "../context/B2BContext";

function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);

  const { addToCart, addToWishlist } = useCartWishlist();
  const { b2bMode } = useB2B();

  const location = useLocation();
  const searchQuery = (new URLSearchParams(location.search).get("q") || "").trim();

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
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryFromUrl = params.get("category") || "";
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [location.search]);

  useEffect(() => {
    setPage(1);
  }, [
    location.search,
    selectedCategory,
    selectedBrand,
    priceRange,
    minRating,
    inStockOnly,
    sortBy,
  ]);

  const brands = useMemo(
    () => Array.from(new Set(products.map((p) => p.brand))),
    [products]
  );

  const filtered = useMemo(() => {
    let res = [...products];
    const searchText = searchQuery.toLowerCase();

    if (searchText) {
      res = res.filter((p) => {
        const combined = `${p.title} ${p.description} ${p.category} ${p.brand}`.toLowerCase();
        return combined.includes(searchText);
      });
    }
    if (selectedCategory) res = res.filter((p) => p.category === selectedCategory);
    if (selectedBrand) res = res.filter((p) => p.brand === selectedBrand);
    res = res.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );
    if (minRating > 0) res = res.filter((p) => p.rating >= minRating);
    if (inStockOnly) res = res.filter((p) => p.in_stock);
    if (sortBy === "price_asc") res.sort((a, b) => a.price - b.price);
    else if (sortBy === "price_desc") res.sort((a, b) => b.price - a.price);
    else if (sortBy === "top_rated") res.sort((a, b) => b.rating - a.rating);
    else if (sortBy === "newest") res.sort((a, b) => b.id - a.id);
    return res;
  }, [
    products,
    selectedCategory,
    selectedBrand,
    priceRange,
    minRating,
    inStockOnly,
    sortBy,
    searchQuery,
  ]);

  const pageSize = 8;
  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, pageCount);
  const startIndex = (currentPage - 1) * pageSize;
  const visible = filtered.slice(startIndex, startIndex + pageSize);

  return (
    <div className="page-container page-layout-sidebar">
      <FilterSidebar
        categories={categories}
        brands={brands}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedBrand={selectedBrand}
        setSelectedBrand={setSelectedBrand}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        minRating={minRating}
        setMinRating={setMinRating}
        inStockOnly={inStockOnly}
        setInStockOnly={setInStockOnly}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      <section>
        <h1 style={{ fontSize: "1.25rem", marginBottom: 4 }}>All Products</h1>
        {searchQuery && (
          <div
            style={{
              fontSize: "0.85rem",
              marginBottom: 8,
              color: "#4b5563",
            }}
          >
            Search results for: <strong>&quot;{searchQuery}&quot;</strong>
          </div>
        )}
        {loading && <div>Loading...</div>}
        {error && <div style={{ color: "#b91c1c" }}>{error}</div>}
        {!loading && !filtered.length && (
          <div className="card" style={{ padding: "1rem", fontSize: "0.9rem" }}>
            {searchQuery ? (
              <>
                No products found for <strong>&quot;{searchQuery}&quot;</strong>.
              </>
            ) : (
              "No products found."
            )}
          </div>
        )}
        {!loading && filtered.length > 0 && (
          <>
            <div className="products-grid">
              {visible.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onAddToCart={addToCart}
                  onAddToWishlist={addToWishlist}
                  businessPrimary={b2bMode}
                />
              ))}
            </div>
            <div className="pagination">
              <button
                type="button"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {pageCount}
              </span>
              <button
                type="button"
                onClick={() =>
                  setPage((prev) => Math.min(pageCount, prev + 1))
                }
                disabled={currentPage === pageCount}
              >
                Next
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default ProductListPage;
