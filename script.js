/* ============ PRODUCTS (USD) — Trending 2026 ============ */
const PRODUCTS = [
  {
    id: 1,
    name: "MagSafe Phone Mount",
    desc: "Strong magnet + suction cup — attach to car, wall, or laptop",
    price: 32.00,
    emoji: "📱",
    badge: "Trending",
    category: "Accessories",
    img: "images/magsafe-mount.jpg"
  },
  {
    id: 2,
    name: "Wireless Earbuds Pro",
    desc: "Active noise cancellation, 30h battery, Bluetooth 5.3",
    price: 89.99,
    emoji: "🎧",
    badge: "Bestseller",
    category: "Audio",
    img: "images/earbuds.jpg"
  },
  {
    id: 3,
    name: "Noise-Cancelling Headphones",
    desc: "Over-ear, 40h battery, premium leather cushions",
    price: 199.00,
    emoji: "🎧",
    badge: "New",
    category: "Audio",
    img: "images/headphones.png"
  },
  {
    id: 4,
    name: "Smart Watch Ultra",
    desc: "AMOLED display, GPS, heart-rate & SpO2 monitor",
    price: 249.00,
    emoji: "⌚",
    badge: "New",
    category: "Wearables",
    img: "images/watch.jpg"
  },
  {
    id: 5,
    name: "Fitness Tracker Band",
    desc: "Step counter, sleep tracking, 7-day battery",
    price: 69.00,
    emoji: "⌚",
    badge: null,
    category: "Wearables",
    img: "images/fitness-band.jpg"
  },
  {
    id: 6,
    name: "Portable Power Bank 20K",
    desc: "20,000mAh, 65W fast charge, dual USB-C",
    price: 45.99,
    emoji: "🔋",
    badge: "Sale",
    category: "Accessories",
    img: "images/powerbank.jpg"
  },
  {
    id: 7,
    name: "MagSafe Wireless Charger",
    desc: "15W fast charge, Qi2 certified, magnetic snap-on",
    price: 34.99,
    emoji: "🔋",
    badge: "Trending",
    category: "Accessories",
    img: "images/magsafe-charger.jpg"
  },
  {
    id: 8,
    name: "Bluetooth Speaker Mini",
    desc: "360° sound, IPX7 waterproof, 12h playtime",
    price: 59.99,
    emoji: "🔊",
    badge: null,
    category: "Audio",
    img: "images/speaker.jpg"
  },
  {
    id: 9,
    name: "Smart LED Desk Lamp",
    desc: "Touch control, 5 brightness levels, USB charging port",
    price: 54.99,
    emoji: "💡",
    badge: "New",
    category: "Smart Home",
    img: "images/desk-lamp.jpg"
  },
  {
    id: 10,
    name: "Smart Plug (4-Pack)",
    desc: "WiFi enabled, voice control, energy monitoring",
    price: 29.99,
    emoji: "🔌",
    badge: "Trending",
    category: "Smart Home",
    img: "images/smart-plug.jpg"
  },
  {
    id: 11,
    name: "USB-C Hub 7-in-1",
    desc: "HDMI 4K, SD card, USB 3.0, 100W PD pass-through",
    price: 49.99,
    emoji: "🔌",
    badge: null,
    category: "Accessories",
    img: "images/usb-hub.png"
  },
  {
    id: 12,
    name: "Gaming Mouse RGB",
    desc: "16,000 DPI sensor, 8 programmable buttons",
    price: 39.99,
    emoji: "🖱️",
    badge: null,
    category: "Accessories",
    img: "images/gaming-mouse.jpg"
  }
];

let cart = JSON.parse(localStorage.getItem("zenoswap_cart") || "[]");

/* ---------- Render products ---------- */
function renderProducts(list = PRODUCTS) {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  grid.innerHTML = list.map(p => `
    <div class="product-card">
      <div class="product-img">
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ""}
        ${p.img 
          ? `<img src="${p.img}" alt="${p.name}" class="product-photo" onerror="this.style.display='none'; this.parentElement.innerHTML += '${p.emoji}';">` 
          : p.emoji}
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

/* ---------- Filter products ---------- */
function filterProducts(category, btn) {
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");

  const filtered = category === "all"
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === category);

  renderProducts(filtered);
}

/* ---------- Add to cart ---------- */
function addToCart(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;

  const existing = cart.find(i => i.id === id);
  if (existing) existing.qty += 1;
  else cart.push({ ...product, qty: 1 });

  saveCart();
  updateCartUI();
  showToast();
}

/* ---------- Cart UI ---------- */
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
      <!-- මෙතනත් image එක පෙන්නන්න හැදුවා (optional) -->
      <div class="cart-item-img">
        ${item.img 
          ? `<img src="${item.img}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;">` 
          : item.emoji}
      </div>
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
  saveCart();
  updateCartUI();
}

function removeItem(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  updateCartUI();
}

function saveCart() {
  localStorage.setItem("zenoswap_cart", JSON.stringify(cart));
}

/* ---------- Drawer ---------- */
function openCart() {
  document.getElementById("cartDrawer").classList.add("show");
  document.getElementById("cartOverlay").classList.add("show");
}

function closeCart() {
  document.getElementById("cartDrawer").classList.remove("show");
  document.getElementById("cartOverlay").classList.remove("show");
}

/* ---------- Checkout nav ---------- */
function goToCheckout() {
  if (cart.length === 0) return;
  window.location.href = "checkout.html";
}

/* ---------- Toast ---------- */
function showToast() {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1800);
}

/* ---------- Init ---------- */
renderProducts();
updateCartUI();