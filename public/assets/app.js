/* =============================================
   KANNUR COCKTAIL — Global JS
   ============================================= */

/* ── CONFIG ── */
const WA_NUMBER = '8861015324'; // WhatsApp number
const ITEM_PRICE = 50;

/* ── LOGO SVG (dark variant, inline) ── */
const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 380" class="nav-logo-svg">
  <defs>
    <linearGradient id="ng1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#f0c060"/><stop offset="50%" stop-color="#c8913a"/><stop offset="100%" stop-color="#8b5e1a"/></linearGradient>
    <linearGradient id="nm" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#f5c842"/><stop offset="40%" stop-color="#f0922a"/><stop offset="100%" stop-color="#d4681a"/></linearGradient>
    <linearGradient id="ngs" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="rgba(255,255,255,0.12)"/><stop offset="100%" stop-color="rgba(255,255,255,0.02)"/></linearGradient>
  </defs>
  <circle cx="170" cy="168" r="132" fill="none" stroke="url(#ng1)" stroke-width="1" opacity="0.6"/>
  <g stroke="url(#ng1)" stroke-width="1.2" opacity="0.55">
    <line x1="170" y1="32" x2="170" y2="42" transform="rotate(0 170 168)"/>
    <line x1="170" y1="32" x2="170" y2="42" transform="rotate(90 170 168)"/>
    <line x1="170" y1="32" x2="170" y2="42" transform="rotate(180 170 168)"/>
    <line x1="170" y1="32" x2="170" y2="42" transform="rotate(270 170 168)"/>
  </g>
  <g opacity="0.7">
    <path d="M 90 155 Q 55 120 30 95 Q 50 130 72 160 Z" fill="#1a4a30"/>
    <path d="M 90 165 Q 45 145 15 130 Q 48 155 80 175 Z" fill="#1a4a30"/>
    <path d="M 250 155 Q 285 120 310 95 Q 290 130 268 160 Z" fill="#1a4a30"/>
    <path d="M 250 165 Q 295 145 325 130 Q 292 155 260 175 Z" fill="#1a4a30"/>
  </g>
  <path d="M 136 105 L 130 250 Q 130 258 138 258 L 202 258 Q 210 258 210 250 L 204 105 Z" fill="rgba(255,255,255,0.04)" stroke="rgba(200,145,58,0.4)" stroke-width="1.2"/>
  <clipPath id="nclip"><path d="M 137 107 L 131 249 Q 131 256 139 256 L 201 256 Q 209 256 209 249 L 203 107 Z"/></clipPath>
  <rect x="128" y="115" width="84" height="143" fill="url(#nm)" clip-path="url(#nclip)" opacity="0.95"/>
  <rect x="128" y="115" width="84" height="143" fill="url(#ngs)" clip-path="url(#nclip)"/>
  <g>
    <path d="M 148 108 Q 142 102 145 97 Q 152 93 156 99 Q 158 105 152 108 Z" fill="#d4a870" opacity="0.95"/>
    <path d="M 175 105 Q 169 99 172 94 Q 179 90 183 96 Q 185 102 179 105 Z" fill="#d4a870" opacity="0.95"/>
    <ellipse cx="156" cy="112" rx="3.5" ry="3" fill="#c0392b" opacity="0.95"/>
    <ellipse cx="169" cy="110" rx="3" ry="2.8" fill="#e74c3c" opacity="0.9"/>
    <ellipse cx="182" cy="112" rx="3.5" ry="3" fill="#c0392b" opacity="0.95"/>
  </g>
  <g opacity="0.8">
    <line x1="60" y1="278" x2="115" y2="278" stroke="url(#ng1)" stroke-width="0.8"/>
    <line x1="225" y1="278" x2="280" y2="278" stroke="url(#ng1)" stroke-width="0.8"/>
    <polygon points="170,272 176,278 170,276 164,278" fill="url(#ng1)"/>
  </g>
  <text x="170" y="308" font-family="'Cinzel',serif" font-size="34" font-weight="700" text-anchor="middle" letter-spacing="10" fill="url(#ng1)">KANNUR</text>
  <text x="170" y="345" font-family="'Cormorant Garamond',serif" font-size="16" font-style="italic" text-anchor="middle" letter-spacing="7" fill="#c8913a" opacity="0.9">cocktail</text>
</svg>`;

/* ── CART STATE ── */
let cart = JSON.parse(localStorage.getItem('kc_cart') || '[]');

function saveCart() { localStorage.setItem('kc_cart', JSON.stringify(cart)); }

function getItem(name) { return cart.find(i => i.name === name); }

function addToCart(name, emoji, type) {
  const existing = getItem(name);
  if (existing) { existing.qty++; }
  else { cart.push({ name, emoji, qty: 1, type: type || '' }); }
  saveCart();
  updateCartUI();
  showCartPop(`${emoji} ${name}`);
  highlightCartBtn();
}

function removeFromCart(name) {
  const existing = getItem(name);
  if (!existing) return;
  if (existing.qty > 1) { existing.qty--; }
  else { cart = cart.filter(i => i.name !== name); }
  saveCart();
  updateCartUI();
}

function clearCart() {
  cart = [];
  saveCart();
  updateCartUI();
}

function getCartCount() { return cart.reduce((sum, i) => sum + i.qty, 0); }
function getTotalCost() { return getCartCount() * ITEM_PRICE; }

function updateCartUI() {
  const count = getCartCount();
  const totalCost = getTotalCost();
  document.querySelectorAll('.cart-badge').forEach(el => {
    el.textContent = count;
    el.classList.toggle('show', count > 0);
  });
  document.querySelectorAll('.cart-total-cost').forEach(el => {
    el.textContent = `Rs ${totalCost}`;
  });
  renderCartItems();
  // Update menu buttons
  document.querySelectorAll('.menu-item[data-name]').forEach(el => {
    const name = el.dataset.name;
    const item = getItem(name);
    const addBtn = el.querySelector('.add-btn');
    const qtyCtrl = el.querySelector('.qty-ctrl');
    if (item && item.qty > 0) {
      if (addBtn) addBtn.style.display = 'none';
      if (qtyCtrl) { qtyCtrl.style.display = 'flex'; qtyCtrl.querySelector('.count').textContent = item.qty; }
    } else {
      if (addBtn) addBtn.style.display = 'flex';
      if (qtyCtrl) qtyCtrl.style.display = 'none';
    }
  });
}

function renderCartItems() {
  const container = document.getElementById('cart-items-list');
  const empty = document.getElementById('cart-empty-state');
  const footer = document.getElementById('cart-footer');
  if (!container) return;
  container.innerHTML = '';
  if (cart.length === 0) {
    if (empty) empty.style.display = 'flex';
    if (footer) footer.style.display = 'none';
    return;
  }
  if (empty) empty.style.display = 'none';
  if (footer) footer.style.display = 'flex';
  cart.forEach(item => {
    const div = document.createElement('div');
    const lineTotal = item.qty * ITEM_PRICE;
    div.className = 'cart-item-row';
    div.innerHTML = `
      <span class="ci-emoji">${item.emoji}</span>
      <div style="flex:1">
        <div class="ci-name">${item.name}</div>
        <div style="font-size:12px;color:var(--muted);font-family:var(--font-ui)">${item.qty} × Rs ${ITEM_PRICE} = Rs ${lineTotal}</div>
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        <button onclick="removeFromCart('${item.name}')" style="width:26px;height:26px;border-radius:50%;border:1px solid var(--border);background:rgba(200,145,58,0.1);color:var(--gold);cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;transition:all 0.2s">−</button>
        <span class="ci-qty">×${item.qty}</span>
        <button onclick="addToCart('${item.name}','${item.emoji}')" style="width:26px;height:26px;border-radius:50%;border:1px solid var(--border);background:rgba(200,145,58,0.1);color:var(--gold);cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;transition:all 0.2s">+</button>
        <button class="ci-remove" onclick="deleteFromCart('${item.name}')">×</button>
      </div>`;
    container.appendChild(div);
  });
}

function deleteFromCart(name) {
  cart = cart.filter(i => i.name !== name);
  saveCart(); updateCartUI();
}

function openCart() {
  document.getElementById('cart-overlay').classList.add('open');
  document.getElementById('cart-sidebar').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  document.getElementById('cart-overlay').classList.remove('open');
  document.getElementById('cart-sidebar').classList.remove('open');
  document.body.style.overflow = '';
}

function formatItemName(item) {
  if (item.type === 'juice') return `${item.name} Juice`;
  if (item.type === 'shake') return `${item.name} Shake`;
  return item.name;
}

function placeOrder() {
  if (cart.length === 0) { showToast('🛒 Cart is empty!'); return; }
  const customerName = document.getElementById('order-name')?.value?.trim() || '';
  const customerFlat = document.getElementById('order-flat')?.value?.trim() || '';
  const customerAddress = document.getElementById('order-address')?.value?.trim() || '';
  if (!customerName || !customerFlat || !customerAddress) {
    showToast('Please enter name, flat no, and address.');
    return;
  }
  const note = document.getElementById('order-note')?.value || '';
  let msg = '🥤 *KANNUR COCKTAIL — New Order*\n\n';
  msg += `👤 Name: ${customerName}\n`;
  msg += `🏠 Flat/Unit: ${customerFlat}\n`;
  msg += `📍 Address: ${customerAddress}\n\n`;
  msg += '*Order Items*\n';
  cart.forEach((item, i) => {
    const itemName = formatItemName(item);
    const lineTotal = item.qty * ITEM_PRICE;
    msg += `${i+1}. ${itemName} - Rs ${lineTotal}\n`;
  });
  const totalCost = getTotalCost();
  msg += `\n💰 Total: Rs ${totalCost}\n`;
  if (note.trim()) msg += `📝 Note: ${note.trim()}\n`;
  msg += '\n_Thank you! 🙏_';
  const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

/* ── TOAST ── */
let toastTimer;
function showToast(msg) {
  let toast = document.getElementById('global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'global-toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
}

let cartPopTimer;
function showCartPop(label) {
  let pop = document.getElementById('cart-pop');
  if (!pop) {
    pop = document.createElement('div');
    pop.id = 'cart-pop';
    pop.className = 'cart-pop';
    pop.innerHTML = '<span class="cart-pop-icon">🛒</span><span class="cart-pop-text"></span>';
    document.body.appendChild(pop);
  }
  const text = pop.querySelector('.cart-pop-text');
  if (text) text.textContent = `Added: ${label}`;
  pop.classList.add('show');
  clearTimeout(cartPopTimer);
  cartPopTimer = setTimeout(() => pop.classList.remove('show'), 1800);
}

let cartHighlightTimer;
function highlightCartBtn() {
  const btns = document.querySelectorAll('.nav-cart-btn');
  btns.forEach(btn => btn.classList.add('cart-highlight'));
  clearTimeout(cartHighlightTimer);
  cartHighlightTimer = setTimeout(() => {
    btns.forEach(btn => btn.classList.remove('cart-highlight'));
  }, 1200);
}

/* ── NAVBAR ── */
function initNavbar() {
  const nav = document.querySelector('.navbar');
  if (!nav) return;

  // Logo
  document.querySelectorAll('.nav-logo-slot').forEach(el => el.innerHTML = LOGO_SVG);

  // Scroll effect
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });

  // Active link
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });

  // Mobile hamburger
  const hamburger = document.querySelector('.nav-hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => navLinks.classList.toggle('mobile-open'));
  }
}

/* ── SCROLL REVEAL ── */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => observer.observe(el));
}

/* ── PARTICLES ── */
function initParticles(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 6 + 2;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random()*100}%;
      bottom:${Math.random()*20}%;
      animation-duration:${8+Math.random()*12}s;
      animation-delay:${Math.random()*8}s;
      opacity:${0.2+Math.random()*0.4};
    `;
    container.appendChild(p);
  }
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initReveal();
  updateCartUI();

  // Cart overlay click to close
  document.getElementById('cart-overlay')?.addEventListener('click', closeCart);
});
