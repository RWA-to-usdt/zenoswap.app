/* ============ PRODUCTS (USD) — Trending 2026 ============ */
const PRODUCTS = [
  {
    id: 1,
    name: "MagSafe Phone Mount",
    desc: "Strong magnet + suction cup — attach to car, wall, or laptop",
    price: 12.99,
    oldPrice: 19.99,
    emoji: "📱",
    badge: "Trending",
    category: "Accessories",
    img: "images/magsafe-mount.jpg"
  },
  {
    id: 2,
    name: "Wireless Earbuds Pro",
    desc: "Active noise cancellation, 30h battery, Bluetooth 5.3",
    price: 24.99,
    oldPrice: 39.99,
    emoji: "🎧",
    badge: "Bestseller",
    category: "Audio",
    img: "images/earbuds.jpg"
  },
  {
    id: 3,
    name: "Noise-Cancelling Headphones",
    desc: "Over-ear, 40h battery, premium leather cushions",
    price: 49.99,
    oldPrice: 69.99,
    emoji: "🎧",
    badge: "New",
    category: "Audio",
    img: "images/headphones.png"
  },
  {
    id: 4,
    name: "Smart Watch Ultra",
    desc: "AMOLED display, GPS, heart-rate & SpO2 monitor",
    price: 59.99,
    oldPrice: 89.99,
    emoji: "⌚",
    badge: "New",
    category: "Wearables",
    img: "images/watch.jpg"
  },
  {
    id: 5,
    name: "Fitness Tracker Band",
    desc: "Step counter, sleep tracking, 7-day battery",
    price: 19.99,
    oldPrice: 29.99,
    emoji: "⌚",
    badge: null,
    category: "Wearables",
    img: "images/fitness-band.jpg"
  },
  {
    id: 6,
    name: "Portable Power Bank 20K",
    desc: "20,000mAh, 65W fast charge, dual USB-C",
    price: 18.99,
    oldPrice: 25.99,
    emoji: "🔋",
    badge: "Sale",
    category: "Accessories",
    img: "images/powerbank.jpg"
  },
  {
    id: 7,
    name: "MagSafe Wireless Charger",
    desc: "15W fast charge, Qi2 certified, magnetic snap-on",
    price: 14.99,
    oldPrice: 22.99,
    emoji: "🔋",
    badge: "Trending",
    category: "Accessories",
    img: "images/magsafe-charger.jpg"
  },
  {
    id: 8,
    name: "Bluetooth Speaker Mini",
    desc: "360° sound, IPX7 waterproof, 12h playtime",
    price: 22.99,
    oldPrice: 34.99,
    emoji: "🔊",
    badge: null,
    category: "Audio",
    img: "images/speaker.jpg"
  },
  {
    id: 9,
    name: "Smart LED Desk Lamp",
    desc: "Touch control, 5 brightness levels, USB charging port",
    price: 16.99,
    oldPrice: 24.99,
    emoji: "💡",
    badge: "New",
    category: "Smart Home",
    img: "images/desk-lamp.jpg"
  },
  {
    id: 10,
    name: "Smart Plug (4-Pack)",
    desc: "WiFi enabled, voice control, energy monitoring",
    price: 15.99,
    oldPrice: 24.99,
    emoji: "🔌",
    badge: "Trending",
    category: "Smart Home",
    img: "images/smart-plug.jpg"
  },
  {
    id: 11,
    name: "USB-C Hub 7-in-1",
    desc: "HDMI 4K, SD card, USB 3.0, 100W PD pass-through",
    price: 19.99,
    oldPrice: 29.99,
    emoji: "🔌",
    badge: null,
    category: "Accessories",
    img: "images/usb-hub.png"
  },
  {
    id: 12,
    name: "Gaming Mouse RGB",
    desc: "16,000 DPI sensor, 8 programmable buttons",
    price: 14.99,
    oldPrice: 19.99,
    emoji: "🖱️",
    badge: null,
    category: "Accessories",
    img: "images/gaming-mouse.jpg"
  }
];

let cart = JSON.parse(localStorage.getItem("zenoswap_cart") || "[]");

/* ============ RENDER PRODUCTS ============ */
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
          <div class="price-box">
            <span class="product-price">$${p.price.toFixed(2)}</span>
            ${p.oldPrice ? `<span class="product-old-price">$${p.oldPrice.toFixed(2)}</span>` : ""}
          </div>
          <button class="add-btn" onclick="addToCart(${p.id})">Add</button>
        </div>
      </div>
    </div>
  `).join("");
}

/* ============ CATEGORY FILTERS ============ */
function filterProducts(category, btn) {
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");

  const filtered = category === "all"
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === category);

  renderProducts(filtered);
}

/* ============ ADD TO CART ============ */
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

/* ============ CART UI ============ */
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

/* ============ DRAWER CONTROLS ============ */
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

/* ============ TOAST ============ */
function showToast() {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1800);
}

/* ============ SOCIAL PROOF NOTIFICATIONS ============ */
const FAKE_NAMES = ["James", "Emma", "Liam", "Olivia", "Noah", "Ava", "William", "Sophia", "Lucas", "Mia", "Arjun", "Priya"];
const FAKE_LOCATIONS = ["New York, US", "London, UK", "Toronto, CA", "Sydney, AU", "California, US", "Manchester, UK", "Vancouver, CA", "Melbourne, AU"];

let notifTimeout;
let hideTimeout;

function showLiveNotification() {
  const notif = document.getElementById("liveNotification");
  if (!notif) return;

  const randomProduct = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
  const randomName = FAKE_NAMES[Math.floor(Math.random() * FAKE_NAMES.length)];
  const randomLocation = FAKE_LOCATIONS[Math.floor(Math.random() * FAKE_LOCATIONS.length)];
  const randomMins = Math.floor(Math.random() * 15) + 1;

  document.getElementById("liveText").innerHTML = `<strong>${randomName}</strong> from ${randomLocation} just bought a <span style="color:#4f46e5; font-weight:600;">${randomProduct.name}</span>`;
  document.getElementById("liveTime").innerText = `${randomMins} minutes ago`;
  
  const imgContainer = document.getElementById("liveImg");
  if (randomProduct.img) {
    imgContainer.innerHTML = `<img src="${randomProduct.img}" alt="product">`;
  } else {
    imgContainer.innerHTML = randomProduct.emoji;
  }

  notif.classList.add("show");

  clearTimeout(hideTimeout);
  hideTimeout = setTimeout(() => {
    notif.classList.remove("show");
  }, 5000);
}

function closeLiveNotif() {
  document.getElementById("liveNotification").classList.remove("show");
  clearTimeout(notifTimeout);
  startNotificationLoop(15000);
}

function startNotificationLoop(delay = 8000) {
  clearTimeout(notifTimeout);
  notifTimeout = setTimeout(() => {
    showLiveNotification();
    const nextDelay = Math.floor(Math.random() * 13000) + 12000; 
    startNotificationLoop(nextDelay);
  }, delay);
}

/* ============ INIT ============ */
renderProducts();
updateCartUI();

// Site load වෙලා තත්පර 4කින් notification පටන් ගන්නවා
document.addEventListener("DOMContentLoaded", () => {
  startNotificationLoop(4000); 
});