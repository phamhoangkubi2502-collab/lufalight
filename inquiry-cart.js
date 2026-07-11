/* ── LUFALIGHT INQUIRY CART ── product showcase + email/phone consultation cart ── */
(function(){
  'use strict';

  var CART_KEY = 'lufa_cart';
  var FORMSPREE = 'https://formspree.io/f/mwvdlyky';

  /* ── STATE ── */
  function getCart(){ try{ return JSON.parse(localStorage.getItem(CART_KEY)||'[]'); }catch(e){ return []; } }
  function saveCart(c){ localStorage.setItem(CART_KEY, JSON.stringify(c)); }

  function addItem(sku, name, price, image){
    var cart = getCart();
    var item = cart.find(function(i){ return i.sku===sku; });
    if(item){ item.qty++; } else { cart.push({sku:sku, name:name, price:parseFloat(price)||0, image:image||'', qty:1}); }
    saveCart(cart);
    updateBadge();
    renderItems();
    openDrawer();
    showToast(name);
  }

  function removeItem(sku){
    saveCart(getCart().filter(function(i){ return i.sku!==sku; }));
    renderItems(); updateBadge();
  }

  function changeQty(sku, delta){
    var cart = getCart();
    var item = cart.find(function(i){ return i.sku===sku; });
    if(!item) return;
    item.qty = Math.max(1, item.qty+delta);
    saveCart(cart); renderItems(); updateBadge();
  }

  function clearCart(){ localStorage.removeItem(CART_KEY); renderItems(); updateBadge(); }

  /* ── BADGE ── */
  function updateBadge(){
    var cart = getCart();
    var count = cart.reduce(function(s,i){ return s+i.qty; },0);
    var badge = document.getElementById('lc-badge');
    if(badge){ badge.textContent=count; badge.style.display=count?'flex':'none'; }
  }

  /* ── TOAST ── */
  function showToast(name){
    var t = document.getElementById('lc-toast');
    if(!t) return;
    t.querySelector('.lc-toast-msg').textContent = '✓ Added: '+(name.split('—')[0]||name).trim();
    t.classList.add('show');
    clearTimeout(t._tid);
    t._tid = setTimeout(function(){ t.classList.remove('show'); }, 2000);
  }

  /* ── DRAWER ── */
  function openDrawer(){ var ov=document.getElementById('lc-drawer-ov'); if(ov) ov.classList.add('open'); }
  function closeDrawer(){ var ov=document.getElementById('lc-drawer-ov'); if(ov) ov.classList.remove('open'); }

  function fmtPrice(n){ return '$'+(n||0).toLocaleString('en-CA')+' CAD'; }

  function renderItems(){
    var cart = getCart();
    var el = document.getElementById('lc-items');
    var footer = document.getElementById('lc-footer');
    if(!el) return;

    if(!cart.length){
      el.innerHTML = '<div class="lc-empty"><div style="font-size:44px;margin-bottom:14px">🛒</div>'
        +'<p style="font-size:14px;color:var(--muted);line-height:1.6">Your inquiry list is empty.<br>Browse products and tap <strong>Add to Inquiry</strong>!</p></div>';
      if(footer) footer.style.display='none';
      return;
    }

    if(footer) footer.style.display='block';
    var total = cart.reduce(function(s,i){ return s+(i.price*i.qty); },0);

    el.innerHTML = cart.map(function(item){
      return '<div class="lc-item">'
        +(item.image?'<img class="lc-img" src="'+item.image+'" alt="" loading="lazy">'
                    :'<div class="lc-img-ph">💡</div>')
        +'<div class="lc-info">'
          +'<div class="lc-name">'+item.name+'</div>'
          +'<div class="lc-price">'+fmtPrice(item.price)+'</div>'
          +'<div class="lc-qty">'
            +'<button class="lc-q-btn" onclick="window._lcQty(\''+item.sku+'\',-1)">−</button>'
            +'<span>'+item.qty+'</span>'
            +'<button class="lc-q-btn" onclick="window._lcQty(\''+item.sku+'\',1)">+</button>'
          +'</div>'
        +'</div>'
        +'<button class="lc-rm" onclick="window._lcRm(\''+item.sku+'\')" title="Remove">✕</button>'
      +'</div>';
    }).join('')
    +'<div class="lc-total">Estimated Total: <strong>'+fmtPrice(total)+'</strong></div>';
  }

  /* ── FORM SUBMIT ── */
  function submitForm(e){
    e.preventDefault();
    var cart = getCart();
    if(!cart.length) return;

    var name  = document.getElementById('lc-fn').value.trim();
    var email = document.getElementById('lc-em').value.trim();
    var phone = document.getElementById('lc-ph').value.trim();
    var msg   = document.getElementById('lc-msg').value.trim();
    if(!name||!email){ alert('Please enter your name and email.'); return; }

    var itemsText = cart.map(function(i){
      return '• '+i.name+' (x'+i.qty+') — '+fmtPrice(i.price);
    }).join('\n');
    var total = cart.reduce(function(s,i){ return s+(i.price*i.qty); },0);

    var btn = document.getElementById('lc-submit');
    btn.textContent='Sending…'; btn.disabled=true;

    fetch(FORMSPREE, {
      method:'POST',
      headers:{'Content-Type':'application/json','Accept':'application/json'},
      body:JSON.stringify({
        _subject:'New Product Inquiry — Lufalight',
        name:name, email:email,
        phone:phone||'Not provided',
        products:itemsText,
        estimated_total:fmtPrice(total),
        message:msg||'Please contact me about these products.',
        _replyto:email
      })
    })
    .then(function(r){ return r.json(); })
    .then(function(d){
      if(d.ok){
        document.getElementById('lc-form-wrap').innerHTML =
          '<div class="lc-success">'
          +'<div style="font-size:42px;margin-bottom:12px">✅</div>'
          +'<h3 style="font-family:\'Inter Tight\',sans-serif;font-weight:800;margin-bottom:8px">Inquiry Sent!</h3>'
          +'<p style="color:var(--muted);font-size:13px;line-height:1.7">Thanks <strong>'+name+'</strong>!<br>'
          +'We\'ll reply to <strong>'+email+'</strong> within 24 hours.</p>'
          +'<button onclick="window._lcClose();window._lcClear()" '
          +'style="margin-top:18px;background:var(--red);color:#fff;border:none;padding:12px 28px;border-radius:7px;font-size:13px;font-weight:700;cursor:pointer;letter-spacing:.05em">Close ✕</button>'
          +'</div>';
        clearCart();
      } else {
        btn.textContent='✉️ Send Inquiry'; btn.disabled=false;
        fallbackMailto(name,email,phone,itemsText,total,msg);
      }
    })
    .catch(function(){
      btn.textContent='✉️ Send Inquiry'; btn.disabled=false;
      fallbackMailto(name,email,phone,itemsText,total,msg);
    });
  }

  function fallbackMailto(name,email,phone,itemsText,total,msg){
    var sub = encodeURIComponent('Product Inquiry — Lufalight');
    var body = encodeURIComponent(
      'Name: '+name+'\nEmail: '+email+'\nPhone: '+(phone||'N/A')
      +'\n\nProducts Interested In:\n'+itemsText
      +'\nEstimated Total: '+fmtPrice(total)
      +'\n\nMessage: '+(msg||'Please contact me about these products.')
    );
    window.open('mailto:lufalight@gmail.com?subject='+sub+'&body='+body);
  }

  /* ── BUILD UI ── */
  function buildUI(){
    /* CSS */
    var css=`
#lc-cart-btn{position:relative;background:none;border:1.5px solid var(--line);color:var(--white);width:40px;height:40px;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;font-size:17px;cursor:pointer;transition:border-color .2s,background .2s;margin-right:4px;flex-shrink:0}
#lc-cart-btn:hover{border-color:var(--red);background:rgba(232,45,45,.07)}
@media(max-width:860px){#lc-cart-btn{width:34px;height:34px;font-size:14px;margin-right:2px}}
@media(max-width:360px){#lc-cart-btn{width:30px;height:30px;font-size:13px;margin-right:0}}
#lc-badge{position:absolute;top:-7px;right:-7px;background:var(--red);color:#fff;font-size:9px;font-weight:800;width:18px;height:18px;border-radius:50%;display:none;align-items:center;justify-content:center;line-height:1;pointer-events:none}
#lc-toast{position:fixed;top:84px;right:20px;z-index:2000;background:var(--card,#fff);color:var(--white);border:1.5px solid var(--red);border-radius:9px;padding:10px 16px;font-size:13px;font-weight:600;box-shadow:0 8px 28px rgba(0,0,0,.16);opacity:0;transform:translateY(-6px);pointer-events:none;transition:opacity .28s,transform .28s;max-width:290px;white-space:nowrap}
#lc-toast.show{opacity:1;transform:none}
#lc-drawer-ov{position:fixed;inset:0;background:rgba(0,0,0,.52);backdrop-filter:blur(4px);z-index:1600;display:none;justify-content:flex-end}
#lc-drawer-ov.open{display:flex}
#lc-drawer{width:min(420px,100vw);background:var(--bg,#fff);border-left:1px solid var(--line);height:100%;display:flex;flex-direction:column;animation:lcSlide .24s ease;font-family:"Plus Jakarta Sans",sans-serif}
@keyframes lcSlide{from{transform:translateX(100%)}to{transform:none}}
.lc-head{padding:18px 20px 15px;border-bottom:1px solid var(--line);display:flex;align-items:center;justify-content:space-between;flex-shrink:0}
.lc-head-t{font-family:"Inter Tight",sans-serif;font-weight:800;font-size:1.1rem;color:var(--white)}
.lc-head-x{background:rgba(128,128,128,.1);border:1px solid var(--line);color:var(--white);width:32px;height:32px;border-radius:50%;font-size:13px;display:grid;place-items:center;cursor:pointer}
.lc-head-x:hover{border-color:var(--red);color:var(--red)}
#lc-items{flex:1;overflow-y:auto;padding:14px 16px}
.lc-item{display:flex;align-items:flex-start;gap:11px;padding:11px 0;border-bottom:1px solid var(--line)}
.lc-img{width:62px;height:62px;object-fit:cover;border-radius:8px;border:1px solid var(--line);flex-shrink:0}
.lc-img-ph{width:62px;height:62px;background:var(--bg2,#f6f6f8);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;border:1px solid var(--line)}
.lc-info{flex:1;min-width:0}
.lc-name{font-size:12px;font-weight:600;line-height:1.4;margin-bottom:3px;color:var(--white);overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.lc-price{font-size:12px;color:var(--red);font-weight:700;margin-bottom:6px}
.lc-qty{display:flex;align-items:center;gap:7px}
.lc-q-btn{background:var(--bg2,#f6f6f8);border:1px solid var(--line);color:var(--white);width:24px;height:24px;border-radius:6px;font-size:15px;display:grid;place-items:center;cursor:pointer;line-height:1;padding:0}
.lc-q-btn:hover{border-color:var(--red)}
.lc-qty span{font-size:13px;font-weight:700;min-width:20px;text-align:center;color:var(--white)}
.lc-rm{background:none;border:none;color:var(--muted,#888);font-size:14px;cursor:pointer;padding:4px;flex-shrink:0;line-height:1;margin-top:2px}
.lc-rm:hover{color:var(--red)}
.lc-empty{text-align:center;padding:56px 20px 40px}
.lc-total{text-align:right;font-size:12.5px;padding:10px 0 2px;color:var(--muted)}
.lc-total strong{color:var(--white);font-size:14px}
#lc-footer{padding:14px 16px 22px;border-top:1px solid var(--line);flex-shrink:0}
.lc-form-t{font-family:"Inter Tight",sans-serif;font-weight:800;font-size:.98rem;color:var(--white);margin-bottom:2px}
.lc-form-sub{font-size:11.5px;color:var(--muted);margin-bottom:12px;line-height:1.5}
.lc-field{margin-bottom:9px}
.lc-field label{display:block;font-size:10px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:var(--muted);margin-bottom:4px}
.lc-field input,.lc-field textarea{width:100%;background:var(--bg2,#f6f6f8);border:1.5px solid var(--line);border-radius:8px;padding:9px 12px;font-size:13px;color:var(--white);font-family:"Plus Jakarta Sans",sans-serif;transition:border-color .2s;box-sizing:border-box}
.lc-field input:focus,.lc-field textarea:focus{outline:none;border-color:var(--red)}
.lc-field textarea{resize:none;height:64px}
#lc-submit{width:100%;background:var(--red,#E82D2D);color:#fff;border:none;border-radius:8px;padding:13px;font-size:13px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;cursor:pointer;transition:background .2s;margin-top:4px}
#lc-submit:hover:not(:disabled){background:#F05555}
#lc-submit:disabled{opacity:.55;cursor:not-allowed}
.lc-success{text-align:center;padding:20px 8px}
`;
    var style=document.createElement('style'); style.textContent=css; document.head.appendChild(style);

    /* Drawer HTML */
    var ov=document.createElement('div'); ov.id='lc-drawer-ov';
    ov.innerHTML='<div id="lc-drawer">'
      +'<div class="lc-head"><span class="lc-head-t">🛒 Inquiry List</span><button class="lc-head-x" id="lc-x">✕</button></div>'
      +'<div id="lc-items"></div>'
      +'<div id="lc-footer" style="display:none">'
        +'<div id="lc-form-wrap">'
          +'<div class="lc-form-t">Request a Consultation</div>'
          +'<div class="lc-form-sub">We\'ll reach out within 24 hours with pricing &amp; advice.</div>'
          +'<form id="lc-form" novalidate>'
            +'<div class="lc-field"><label>Your Name *</label><input id="lc-fn" type="text" placeholder="Jane Smith" required></div>'
            +'<div class="lc-field"><label>Email *</label><input id="lc-em" type="email" placeholder="jane@email.com" required></div>'
            +'<div class="lc-field"><label>Phone (optional)</label><input id="lc-ph" type="tel" placeholder="+1 (416) 555-0100"></div>'
            +'<div class="lc-field"><label>Message (optional)</label><textarea id="lc-msg" placeholder="Any questions about these products?"></textarea></div>'
            +'<button type="submit" id="lc-submit">✉️ Send Inquiry</button>'
          +'</form>'
        +'</div>'
      +'</div>'
    +'</div>';
    document.body.appendChild(ov);

    /* Toast */
    var toast=document.createElement('div'); toast.id='lc-toast';
    toast.innerHTML='<span class="lc-toast-msg"></span>';
    document.body.appendChild(toast);

    /* Cart button in nav */
    var nav=document.querySelector('nav');
    if(nav){
      var cartBtn=document.createElement('button');
      cartBtn.id='lc-cart-btn'; cartBtn.title='View Inquiry List'; cartBtn.setAttribute('aria-label','Open inquiry cart');
      cartBtn.innerHTML='🛒<span id="lc-badge"></span>';
      var themeBtn=document.getElementById('theme-toggle');
      if(themeBtn){ nav.insertBefore(cartBtn,themeBtn); } else { nav.appendChild(cartBtn); }
      cartBtn.addEventListener('click',openDrawer);
    }

    /* Events */
    document.getElementById('lc-x').addEventListener('click',closeDrawer);
    ov.addEventListener('click',function(e){ if(e.target===ov) closeDrawer(); });
    document.getElementById('lc-form').addEventListener('submit',submitForm);
    document.addEventListener('keydown',function(e){ if(e.key==='Escape') closeDrawer(); });

    /* Expose helpers for inline onclick */
    window._lcQty=changeQty; window._lcRm=removeItem;
    window._lcClose=closeDrawer; window._lcClear=clearCart;

    /* Listen for Add-to-Cart button clicks (capture phase) */
    document.addEventListener('click',function(e){
      var btn=e.target.closest('.lufa-add-cart,.lufa-buy-cart');
      if(!btn) return;
      e.preventDefault(); e.stopPropagation();
      addItem(
        btn.getAttribute('data-item-id'),
        btn.getAttribute('data-item-name'),
        btn.getAttribute('data-item-price'),
        btn.getAttribute('data-item-image')
      );
    },true);
  }

  /* ── INIT ── */
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',function(){ buildUI(); updateBadge(); });
  } else { buildUI(); updateBadge(); }

})();
