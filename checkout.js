/* ── LUFALIGHT CART + CHECKOUT ──
   Real shopping cart: "Add to Cart" buttons (class .snipcart-add-item, keeping the old
   class name so no HTML markup had to change) add items to a localStorage-backed cart
   instead of buying instantly. A self-injected drawer lets the customer review/edit the
   cart, then "Proceed to Checkout" sends the whole cart to our backend, which creates a
   single Stripe Checkout Session for all items and redirects the browser there. */
(function () {
  // Once the backend is deployed, host it at a subdomain (recommended: api.lufalight.com)
  // and switch the default below from localhost to that URL. www.lufalight.com is already
  // whitelisted in backend/.env.example's CORS_ORIGINS.
  var BACKEND_URL = window.LUFALIGHT_BACKEND_URL || 'http://localhost:4000';
  // var BACKEND_URL = window.LUFALIGHT_BACKEND_URL || 'https://api.lufalight.com';

  var CART_KEY = 'lufa_cart';

  function fmt(cents) {
    return '$' + (cents).toLocaleString('en-CA');
  }

  function getCart() {
    try {
      var raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }

  function saveCart(cart) {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) {}
    renderBadge();
  }

  function addToCart(item) {
    var cart = getCart();
    var existing = cart.find(function (i) { return i.sku === item.sku; });
    if (existing) existing.qty += item.qty;
    else cart.push(item);
    saveCart(cart);
    return cart;
  }

  function removeFromCart(sku) {
    saveCart(getCart().filter(function (i) { return i.sku !== sku; }));
    renderDrawer();
  }

  function setQty(sku, qty) {
    var cart = getCart();
    var item = cart.find(function (i) { return i.sku === sku; });
    if (!item) return;
    item.qty = Math.max(1, qty);
    saveCart(cart);
    renderDrawer();
  }

  function cartCount() {
    return getCart().reduce(function (sum, i) { return sum + i.qty; }, 0);
  }

  function cartTotalCents() {
    return getCart().reduce(function (sum, i) { return sum + i.qty * i.price; }, 0);
  }

  /* ── UI injection (drawer + nav badge) ── */
  function ensureDrawer() {
    if (document.getElementById('cart-drawer')) return;

    var overlay = document.createElement('div');
    overlay.id = 'cart-overlay';
    overlay.innerHTML =
      '<div id="cart-drawer">' +
      '  <div class="cart-drawer-head">' +
      '    <h3>Your Cart</h3>' +
      '    <button id="cart-close" aria-label="Close cart">&#10005;</button>' +
      '  </div>' +
      '  <div id="cart-items"></div>' +
      '  <div id="cart-footer">' +
      '    <div id="cart-total-row"><span>Subtotal</span><span id="cart-total">$0</span></div>' +
      '    <button id="cart-checkout-btn" class="btn-r" style="width:100%;justify-content:center">Proceed to Checkout</button>' +
      '    <div id="cart-msg"></div>' +
      '  </div>' +
      '</div>';
    document.body.appendChild(overlay);

    var style = document.createElement('style');
    style.textContent =
      '#cart-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:3000;display:none;justify-content:flex-end}' +
      '#cart-overlay.open{display:flex}' +
      '#cart-drawer{width:min(380px,92vw);background:var(--bg,#fff);height:100%;display:flex;flex-direction:column;box-shadow:-12px 0 40px rgba(0,0,0,.25)}' +
      '.cart-drawer-head{display:flex;justify-content:space-between;align-items:center;padding:18px 20px;border-bottom:1px solid var(--line,rgba(0,0,0,.1))}' +
      '.cart-drawer-head h3{font-size:1.05rem;font-weight:800;color:var(--white,#14151A);margin:0}' +
      '#cart-close{background:none;border:none;font-size:16px;cursor:pointer;color:var(--white,#14151A)}' +
      '#cart-items{flex:1;overflow-y:auto;padding:12px 20px}' +
      '.cart-item{display:flex;gap:10px;padding:12px 0;border-bottom:1px solid var(--line,rgba(0,0,0,.08))}' +
      '.cart-item img{width:56px;height:56px;object-fit:contain;background:rgba(10,10,15,.04);border-radius:8px;flex-shrink:0}' +
      '.cart-item-info{flex:1;min-width:0}' +
      '.cart-item-name{font-size:13px;font-weight:700;color:var(--white,#14151A);margin-bottom:4px;line-height:1.3}' +
      '.cart-item-price{font-size:12.5px;color:var(--muted,#5C606B)}' +
      '.cart-item-row{display:flex;align-items:center;gap:8px;margin-top:6px}' +
      '.cart-qty-btn{width:24px;height:24px;border:1px solid var(--line,rgba(0,0,0,.1));background:none;border-radius:6px;cursor:pointer;font-size:13px;color:var(--white,#14151A)}' +
      '.cart-remove{background:none;border:none;color:var(--red,#E82D2D);font-size:11.5px;cursor:pointer;margin-left:auto}' +
      '.cart-empty{color:var(--muted,#5C606B);font-size:13px;text-align:center;padding:40px 0}' +
      '#cart-footer{padding:18px 20px;border-top:1px solid var(--line,rgba(0,0,0,.1))}' +
      '#cart-total-row{display:flex;justify-content:space-between;font-size:14px;font-weight:700;color:var(--white,#14151A);margin-bottom:14px}' +
      '#cart-msg{font-size:12px;color:var(--red,#E82D2D);margin-top:8px;text-align:center}' +
      '.cart-toggle{position:relative;background:none;border:1px solid var(--line,rgba(0,0,0,.1));color:var(--white,#14151A);width:38px;height:38px;border-radius:8px;display:grid;place-items:center;font-size:16px;cursor:pointer;margin-left:8px;flex-shrink:0}' +
      '.cart-toggle:hover{border-color:var(--red,#E82D2D)}' +
      '.cart-badge{position:absolute;top:-6px;right:-6px;background:var(--red,#E82D2D);color:#fff;font-size:10px;font-weight:800;border-radius:50px;min-width:16px;height:16px;display:flex;align-items:center;justify-content:center;padding:0 3px}';
    document.head.appendChild(style);

    document.getElementById('cart-close').addEventListener('click', closeDrawer);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeDrawer(); });
    document.getElementById('cart-checkout-btn').addEventListener('click', checkoutCart);
  }

  function renderDrawer() {
    ensureDrawer();
    var cart = getCart();
    var itemsEl = document.getElementById('cart-items');

    if (!cart.length) {
      itemsEl.innerHTML = '<div class="cart-empty">Your cart is empty.</div>';
    } else {
      itemsEl.innerHTML = cart.map(function (i) {
        return '<div class="cart-item">' +
          (i.image ? '<img src="' + i.image + '" alt="" onerror="this.style.display=\'none\'"/>' : '') +
          '<div class="cart-item-info">' +
          '<div class="cart-item-name">' + i.name + '</div>' +
          '<div class="cart-item-price">' + fmt(i.price) + ' &times; ' + i.qty + '</div>' +
          '<div class="cart-item-row">' +
          '<button class="cart-qty-btn" data-sku="' + i.sku + '" data-d="-1">&minus;</button>' +
          '<span>' + i.qty + '</span>' +
          '<button class="cart-qty-btn" data-sku="' + i.sku + '" data-d="1">+</button>' +
          '<button class="cart-remove" data-sku="' + i.sku + '">Remove</button>' +
          '</div></div></div>';
      }).join('');

      itemsEl.querySelectorAll('.cart-qty-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var sku = btn.getAttribute('data-sku');
          var delta = Number(btn.getAttribute('data-d'));
          var item = getCart().find(function (i) { return i.sku === sku; });
          if (item) setQty(sku, item.qty + delta);
        });
      });
      itemsEl.querySelectorAll('.cart-remove').forEach(function (btn) {
        btn.addEventListener('click', function () { removeFromCart(btn.getAttribute('data-sku')); });
      });
    }

    document.getElementById('cart-total').textContent = fmt(cartTotalCents());
    document.getElementById('cart-checkout-btn').disabled = cart.length === 0;
  }

  function renderBadge() {
    var badge = document.getElementById('cart-badge');
    if (!badge) return;
    var count = cartCount();
    badge.textContent = String(count);
    badge.style.display = count > 0 ? 'flex' : 'none';
  }

  function openDrawer() {
    ensureDrawer();
    renderDrawer();
    document.getElementById('cart-overlay').classList.add('open');
  }

  function closeDrawer() {
    var el = document.getElementById('cart-overlay');
    if (el) el.classList.remove('open');
  }

  async function checkoutCart() {
    var cart = getCart();
    if (!cart.length) return;

    var btn = document.getElementById('cart-checkout-btn');
    var msgEl = document.getElementById('cart-msg');
    btn.disabled = true;
    btn.textContent = 'Loading…';
    msgEl.textContent = '';

    try {
      var affiliateCode = (new URLSearchParams(window.location.search)).get('ref') ||
        localStorage.getItem('lufa_affiliate_code') || '';

      var res = await fetch(BACKEND_URL + '/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(function (i) { return { sku: i.sku, qty: i.qty }; }),
          affiliate_code: affiliateCode,
        }),
      });
      var data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Checkout failed');

      localStorage.removeItem(CART_KEY);
      window.location.href = data.url;
    } catch (err) {
      console.error('[cart checkout]', err);
      msgEl.textContent = 'Sorry, checkout is temporarily unavailable. Please try again or contact support.';
      btn.disabled = false;
      btn.textContent = 'Proceed to Checkout';
    }
  }

  /* ── Add-to-cart button wiring ── */
  function handleAddClick(btn) {
    var sku = btn.getAttribute('data-item-id');
    if (!sku) return;
    var qty = parseInt(btn.getAttribute('data-item-qty') || '1', 10) || 1;

    addToCart({
      sku: sku,
      name: btn.getAttribute('data-item-name') || sku,
      price: Number(btn.getAttribute('data-item-price')) || 0,
      image: btn.getAttribute('data-item-image') || '',
      qty: qty,
    });

    var original = btn.textContent;
    btn.textContent = '✓ Added!';
    btn.disabled = true;
    setTimeout(function () { btn.textContent = original; btn.disabled = false; }, 1200);

    openDrawer();
  }

  /* ── Buy Now: instant single-item checkout, bypasses the cart entirely ── */
  async function handleBuyNowClick(btn) {
    var sku = btn.getAttribute('data-item-id');
    if (!sku) return;
    var qty = parseInt(btn.getAttribute('data-item-qty') || '1', 10) || 1;

    var original = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Loading…';

    try {
      var affiliateCode = (new URLSearchParams(window.location.search)).get('ref') ||
        localStorage.getItem('lufa_affiliate_code') || '';

      var res = await fetch(BACKEND_URL + '/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{ sku: sku, qty: qty }],
          affiliate_code: affiliateCode,
        }),
      });
      var data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Checkout failed');
      window.location.href = data.url;
    } catch (err) {
      console.error('[buy now]', err);
      alert('Sorry, checkout is temporarily unavailable. Please try again or contact support.');
      btn.disabled = false;
      btn.textContent = original;
    }
  }

  // Persist an affiliate ref code (?ref=CODE) for the session so it's attached
  // to checkout even if the customer browses a few pages before buying.
  var ref = (new URLSearchParams(window.location.search)).get('ref');
  if (ref) localStorage.setItem('lufa_affiliate_code', ref);

  // Capture phase (not bubble) so this still fires even when a button's own inline
  // onclick="event.stopPropagation()" — used to stop card-level click-through — would
  // otherwise block a bubble-phase document listener from ever seeing the click.
  document.addEventListener('click', function (e) {
    var buyBtn = e.target.closest('.snipcart-buy-now');
    if (buyBtn) { e.preventDefault(); handleBuyNowClick(buyBtn); return; }

    var addBtn = e.target.closest('.snipcart-add-item');
    if (addBtn) { e.preventDefault(); handleAddClick(addBtn); return; }

    var cartToggle = e.target.closest('#cart-toggle, .cart-link');
    if (cartToggle) { e.preventDefault(); openDrawer(); return; }
  }, true);

  document.addEventListener('DOMContentLoaded', renderBadge);
  if (document.readyState !== 'loading') renderBadge();

  // Expose for debugging / other scripts (e.g. order-confirmed.html could clear the cart).
  window.LufaCart = { getCart: getCart, addToCart: addToCart, openDrawer: openDrawer, closeDrawer: closeDrawer };
})();
