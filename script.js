/* ============ PRODUCTS (USD) ============ */
const PRODUCTS = [
  { id: 1, name: "Wireless Earbuds Pro", desc: "ANC, 30h battery, Bluetooth 5.3", price: 89.99, emoji: "🎧", badge: "Bestseller" },
  { id: 2, name: "Smart Watch Ultra", desc: "AMOLED, GPS, heart-rate monitor", price: 249.00, emoji: "⌚", badge: "New" },
  { id: 3, name: "Mechanical Keyboard", desc: "RGB, hot-swap, USB-C", price: 119.50, emoji: "⌨️", badge: null },
  { id: 4, name: "4K Webcam", desc: "Auto-focus, noise-cancelling mic", price: 79.00, emoji: "📷", badge: null },
  { id: 5, name: "Wireless Charger Pad", desc: "15W fast charge, Qi-certified", price: 34.99, emoji: "🔋", badge: "Sale" },
  { id: 6, name: "USB-C Hub 7-in-1", desc: "HDMI, SD, USB 3.0, PD", price: 49.99, emoji: "🔌", badge: null }
];

let cart = JSON.parse(localStorage.getItem("zenoswap_cart") || "[]");

/* ---------- Render ---------- */
function renderProducts() {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  grid.innerHTML = PRODUCTS.map(p => `
    <div class="product-card">
      <div class="product-img">
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ""}
        ${p.emoji}
      </div>
      <div class="product-body">
        <div class="product-name">${p.name}</div>
        <div class="product-desc">${p.desc}</div>
        <div class="product-foot">
          <span class="product-price">$${p.price.toFixed(2)}</span>
          <button class="add-btn" onclick="addToCart(${p.id})">Add</button>
        </div>
      </div>
    </div>
  `).join("");
}

function addToCart(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;
  const existing = cart.find(i => i.id === id);
  if (existing) existing.qty += 1;
  else cart.push({ ...product, qty: 1 });
  saveCart(); updateCartUI(); showToast();
}

function updateCartUI() {
  const countEl = document.getElementById("cartCount");
  const itemsEl = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");
  const checkoutBtn = document.getElementById("checkoutBtn");

  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s, i) => s + (i.price * i.qty), 0);

  if (countEl) countEl.innerText = totalQty;
  if (totalEl) totalEl.innerText = `$${totalPrice.toFixed(2)}`;
  if (checkoutBtn) checkoutBtn.disabled = cart.length === 0;
  if (!itemsEl) return;

  if (cart.length === 0) {
    itemsEl.innerHTML = `<p class="empty-cart">Your cart is empty 🛒</p>`;
    return;
  }

  itemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-img">${item.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
        <div class="qty-controls">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
          <button class="remove-btn" onclick="removeItem(${item.id})">Remove</button>
        </div>
      </div>
    </div>
  `).join("");
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
  saveCart(); updateCartUI();
}

function removeItem(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart(); updateCartUI();
}

function saveCart() { localStorage.setItem("zenoswap_cart", JSON.stringify(cart)); }

function openCart() {
  document.getElementById("cartDrawer").classList.add("show");
  document.getElementById("cartOverlay").classList.add("show");
}

function closeCart() {
  document.getElementById("cartDrawer").classList.remove("show");
  document.getElementById("cartOverlay").classList.remove("show");
}

function goToCheckout() {
  if (cart.length === 0) return;
  window.location.href = "checkout.html";
}

function showToast() {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1800);
}

renderProducts();
updateCartUI();