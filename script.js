/* ============ PRODUCTS DATA ============ */
const PRODUCTS = [
  { id: 1, name: "Baby Diapers Pack", desc: "Soft, breathable, ultra-absorbent", price: 850.00, emoji: "👶", badge: "Bestseller" },
  { id: 2, name: "Wet Wipes (80 pcs)", desc: "Fragrance-free, gentle on skin", price: 420.00, emoji: "🧻", badge: null },
  { id: 3, name: "Baby Onesie Set", desc: "100% organic cotton, pack of 3", price: 1250.00, emoji: "👕", badge: "New" },
  { id: 4, name: "Baby Lotion 200ml", desc: "Hypoallergenic, dermatologist tested", price: 690.00, emoji: "🧴", badge: null },
  { id: 5, name: "Feeding Bottle", desc: "BPA-free, anti-colic design", price: 550.00, emoji: "🍼", badge: null },
  { id: 6, name: "Baby Towel Set", desc: "Extra soft hooded towels, pack of 2", price: 980.00, emoji: "🧸", badge: "Sale" }
];

/* ============ CART STATE ============ */
let cart = JSON.parse(localStorage.getItem("velona_cart") || "[]");

/* ============ RENDER PRODUCTS ============ */
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
          <span class="product-price">Rs. ${p.price.toFixed(2)}</span>
          <button class="add-btn" onclick="addToCart(${p.id})">Add</button>
        </div>
      </div>
    </div>
  `).join("");
}

/* ============ ADD TO CART ============ */
function addToCart(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;

  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveCart();
  updateCartUI();
  showToast();
}

/* ============ CART UI ============ */
function updateCartUI() {
  const countEl = document.getElementById("cartCount");
  const itemsEl = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");
  const checkoutBtn = document.getElementById("checkoutBtn");

  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s, i) => s + (i.price * i.qty), 0);

  if (countEl) countEl.innerText = totalQty;
  if (totalEl) totalEl.innerText = `Rs. ${totalPrice.toFixed(2)}`;

  if (checkoutBtn) {
    checkoutBtn.disabled = cart.length === 0;
  }

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
        <div class="cart-item-price">Rs. ${(item.price * item.qty).toFixed(2)}</div>
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
  saveCart();
  updateCartUI();
}

function removeItem(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  updateCartUI();
}

function saveCart() {
  localStorage.setItem("velona_cart", JSON.stringify(cart));
}

/* ============ CART DRAWER ============ */
function openCart() {
  document.getElementById("cartDrawer").classList.add("show");
  document.getElementById("cartOverlay").classList.add("show");
}

function closeCart() {
  document.getElementById("cartDrawer").classList.remove("show");
  document.getElementById("cartOverlay").classList.remove("show");
}

/* ============ CHECKOUT NAV ============ */
function goToCheckout() {
  if (cart.length === 0) return;
  window.location.href = "checkout.html";
}

/* ============ TOAST ============ */
function showToast() {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1800);
}

/* ============ INIT ============ */
renderProducts();
updateCartUI();