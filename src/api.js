export const API_BASE_URL = "http://localhost:8000";

async function handle(res) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "API error");
  }
  return res.json();
}

export async function fetchProducts(params = {}) {
  const url = new URL(`${API_BASE_URL}/products`);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") {
      url.searchParams.append(k, v);
    }
  });
  return handle(await fetch(url.toString()));
}

export async function fetchProductById(id) {
  return handle(await fetch(`${API_BASE_URL}/products/${id}`));
}

export async function fetchCategories() {
  return handle(await fetch(`${API_BASE_URL}/categories`));
}

export async function fetchWishlist() {
  return handle(await fetch(`${API_BASE_URL}/wishlist`));
}

export async function addToWishlist(productId) {
  return handle(
    await fetch(`${API_BASE_URL}/wishlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: productId, quantity: 1 }),
    })
  );
}

export async function removeFromWishlist(productId) {
  return handle(
    await fetch(`${API_BASE_URL}/wishlist/${productId}`, {
      method: "DELETE",
    })
  );
}

export async function fetchCart() {
  return handle(await fetch(`${API_BASE_URL}/cart`));
}

export async function addOrUpdateCart(productId, quantity) {
  return handle(
    await fetch(`${API_BASE_URL}/cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: productId, quantity }),
    })
  );
}

export async function deleteCartItem(productId) {
  return handle(
    await fetch(`${API_BASE_URL}/cart/${productId}`, {
      method: "DELETE",
    })
  );
}

export async function checkout(payload) {
  return handle(
    await fetch(`${API_BASE_URL}/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
  );
}

export async function createInvoice(orderId) {
  return handle(
    await fetch(`${API_BASE_URL}/create-invoice`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order_id: orderId }),
    })
  );
}

export async function fetchOrders() {
  return handle(await fetch(`${API_BASE_URL}/orders`));
}

export async function updateProductStock(productId, inStock) {
  return handle(
    await fetch(`${API_BASE_URL}/seller/products/${productId}/stock`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ in_stock: inStock }),
    })
  );
}

export async function createSellerOrder(payload) {
  return handle(
    await fetch(`${API_BASE_URL}/seller/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
  );
}
