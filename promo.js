/* ── SUMMER PROMO CONFIG — set before any page JS runs card rendering ──
   pct applies sitewide; bundlePct overrides it for coll==='bundle' products. */
window.LUFA_PROMO = { active: true, pct: 0.15, bundlePct: 0.20, label: 'Big Summer Deal' };
window.salePrice = function(p, coll){ if(!window.LUFA_PROMO.active) return p; var pct = coll==='bundle' ? window.LUFA_PROMO.bundlePct : window.LUFA_PROMO.pct; return Math.round(p * (1 - pct)); };

/* ── LUFALIGHT PROMO WIDGETS ── WIP Notice + Discount Popup + Exit Intent Popup ──
   Timing/frequency notes (see conversation for full reasoning):
   - WIP notice: small dismissible corner badge, shown until closed once (localStorage), never blocks the page.
   - Discount popup: fires once ~2.5s after load, then stays quiet for 3 days (localStorage cooldown)
     so repeat visits in the same week aren't nagged; extends to 14 days once the visitor clicks through.
   - Exit-intent stays session-based (sessionStorage) since it's a last-chance nudge, not a landing offer. */
(function(){
  /* inject self-contained CSS */
  var css = `
  #ei-ov{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:1200;display:none;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px)}
  #ei-ov.open{display:flex}
  #ei-card{background:#FFFFFF;border:1px solid rgba(0,0,0,.08);box-shadow:0 24px 60px rgba(0,0,0,.18);border-radius:18px;padding:36px 32px;max-width:420px;width:100%;text-align:center;position:relative;animation:eiPop .35s ease}
  @keyframes eiPop{from{transform:scale(.9);opacity:0}to{transform:none;opacity:1}}
  #ei-close{position:absolute;top:14px;right:14px;background:rgba(0,0,0,.06);border:none;color:#14151A;width:30px;height:30px;border-radius:50%;font-size:14px;cursor:pointer}
  #ei-card .ei-ic{font-size:38px;margin-bottom:10px}
  #ei-card h3{font-family:"Inter Tight",sans-serif;font-size:1.4rem;font-weight:800;color:#14151A;margin-bottom:8px}
  #ei-card p{font-size:13px;color:#5C606B;line-height:1.65;margin-bottom:18px}
  #ei-code{display:inline-flex;align-items:center;gap:10px;background:rgba(232,45,45,.08);border:1.5px dashed #E82D2D;border-radius:9px;padding:11px 20px;margin-bottom:14px}
  #ei-code span{font-family:"Inter Tight",sans-serif;font-size:1.15rem;font-weight:900;letter-spacing:.08em;color:#14151A}
  #ei-code button{background:#E82D2D;color:#fff;border:none;border-radius:6px;font-size:10.5px;font-weight:700;text-transform:uppercase;padding:6px 10px;cursor:pointer}
  #ei-timer{font-size:12px;color:#A8761E;font-weight:700;margin-bottom:18px}
  #ei-cta{display:inline-flex;background:#E82D2D;color:#fff;font-size:13px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;padding:13px 28px;border-radius:7px;border:none;cursor:pointer;text-decoration:none}
  `;
  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ── shared time-based cooldown (localStorage) ──
     stores the timestamp a key is suppressed UNTIL, so "how many days" reads directly at the call site */
  function isSuppressed(key){
    var until = parseInt(localStorage.getItem(key), 10);
    return !!until && Date.now() < until;
  }
  function suppressFor(key, days){
    localStorage.setItem(key, String(Date.now() + days*86400000));
  }

  /* ── WORK-IN-PROGRESS NOTICE ── */
  function setupWipBadge(){
    var KEY = 'lufa_wip_dismissed';
    if(localStorage.getItem(KEY)) return;

    var css0 = `
    #wip-badge{position:fixed;left:16px;bottom:82px;z-index:960;background:#1B1C24;color:#fff;border:1px solid rgba(255,255,255,.14);border-radius:100px;padding:10px 10px 10px 16px;display:flex;align-items:center;gap:10px;font-size:11.5px;font-weight:600;line-height:1.4;box-shadow:0 10px 28px rgba(0,0,0,.3);max-width:300px}
    #wip-badge button{background:rgba(255,255,255,.14);border:none;color:#fff;width:20px;height:20px;border-radius:50%;font-size:10px;cursor:pointer;flex-shrink:0;display:grid;place-items:center}
    #wip-badge button:hover{background:rgba(255,255,255,.26)}
    @media(max-width:480px){#wip-badge{left:10px;right:10px;bottom:140px;max-width:none}}
    `;
    var s0 = document.createElement('style'); s0.textContent = css0; document.head.appendChild(s0);

    var b = document.createElement('div');
    b.id = 'wip-badge';
    b.innerHTML = '<span>🚧 This site is a work in progress — some content is still being finalized.</span><button aria-label="Dismiss">✕</button>';
    document.body.appendChild(b);
    b.querySelector('button').onclick = function(){
      localStorage.setItem(KEY, '1');
      b.remove();
    };
  }

  /* ── EXIT INTENT POPUP ── */
  function buildExitPopup(){
    var ov = document.createElement('div');
    ov.id = 'ei-ov';
    ov.innerHTML = '<div id="ei-card">'+
      '<button id="ei-close" aria-label="Close">✕</button>'+
      '<div class="ei-ic">🎁</div>'+
      '<h3>Wait — Don\'t Miss 15% Off!</h3>'+
      '<p>Get <b>15% off</b> your first Lufalight order. Use this code at checkout — limited time only.</p>'+
      '<div id="ei-code"><span>WELCOME15</span><button id="ei-copy">Copy</button></div>'+
      '<div id="ei-timer">Expires in <span id="ei-mm">09</span>:<span id="ei-ss">59</span></div>'+
      '<a id="ei-cta" href="shop-all.html">Shop Now &rarr;</a>'+
      '</div>';
    document.body.appendChild(ov);
    return ov;
  }

  function setupExitIntent(){
    var KEY = 'lufa_exit_shown';
    if(sessionStorage.getItem(KEY)) return;
    var ov = buildExitPopup();
    var armed = false;
    setTimeout(function(){ armed = true; }, 3000);

    function open(){
      if(sessionStorage.getItem(KEY)) return;
      sessionStorage.setItem(KEY,'1');
      ov.classList.add('open');
      var secs = 599;
      var mm = document.getElementById('ei-mm'), ss = document.getElementById('ei-ss');
      var iv = setInterval(function(){
        secs--; if(secs<0){ clearInterval(iv); return; }
        mm.textContent = String(Math.floor(secs/60)).padStart(2,'0');
        ss.textContent = String(secs%60).padStart(2,'0');
      },1000);
      document.getElementById('ei-close').onclick = function(){ ov.classList.remove('open'); clearInterval(iv); };
      document.getElementById('ei-copy').onclick = function(){
        navigator.clipboard && navigator.clipboard.writeText('WELCOME15');
        var b = document.getElementById('ei-copy'); b.textContent='Copied!'; setTimeout(function(){b.textContent='Copy';},1500);
      };
      ov.addEventListener('click', function(e){ if(e.target===ov) ov.classList.remove('open'); });
    }

    document.addEventListener('mouseout', function(e){
      if(!armed) return;
      if(e.clientY <= 0 && !e.relatedTarget) open();
    });
    document.addEventListener('keydown', function(e){
      if(e.key==='Escape') ov.classList.remove('open');
    });
  }

  /* ── DISCOUNT POPUP ── */
  function setupSoftOpeningPopup(){
    var KEY = 'lufa_soft_suppress_until';
    if(isSuppressed(KEY)) return;

    var css2 = `
    #so-ov{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:1300;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(6px)}
    #so-card{background:#fff;border-radius:20px;padding:40px 32px 32px;max-width:440px;width:100%;text-align:center;position:relative;animation:soPop .4s cubic-bezier(.34,1.56,.64,1)}
    @keyframes soPop{from{transform:scale(.8) translateY(30px);opacity:0}to{transform:none;opacity:1}}
    #so-close{position:absolute;top:14px;right:14px;background:rgba(0,0,0,.07);border:none;color:#14151A;width:30px;height:30px;border-radius:50%;font-size:14px;cursor:pointer;display:grid;place-items:center}
    #so-badge{display:inline-block;background:#E82D2D;color:#fff;font-size:11px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;padding:5px 14px;border-radius:50px;margin-bottom:16px}
    #so-card h2{font-family:"Inter Tight",sans-serif;font-size:1.8rem;font-weight:900;color:#14151A;line-height:1.15;margin-bottom:10px}
    #so-card h2 span{color:#E82D2D}
    #so-card p{font-size:13.5px;color:#5C606B;line-height:1.65;margin-bottom:22px}
    #so-cta{display:inline-flex;background:#E82D2D;color:#fff;font-size:13px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;padding:14px 32px;border-radius:8px;border:none;cursor:pointer;text-decoration:none;gap:6px}
    #so-cta:hover{background:#c52222}
    #so-skip{display:block;margin-top:12px;font-size:12px;color:#9CA3AF;cursor:pointer;background:none;border:none;text-decoration:underline}
    @media(max-width:480px){#so-card{padding:32px 20px 24px}#so-card h2{font-size:1.45rem}}
    `;
    var s2 = document.createElement('style'); s2.textContent = css2; document.head.appendChild(s2);

    var ov = document.createElement('div');
    ov.id = 'so-ov';
    ov.innerHTML =
      '<div id="so-card">' +
      '<button id="so-close" aria-label="Close">✕</button>' +
      '<div id="so-badge">Big Summer Discount</div>' +
      '<h2><span>15% Off</span></h2>' +
      '<p>Our full range of red light therapy devices — 20% off bundles. Limited-time offer starts today!</p>' +
      '<a id="so-cta" href="shop-all.html">Shop All Deals &rarr;</a>' +
      '<button id="so-skip">Maybe later</button>' +
      '</div>';
    document.body.appendChild(ov);

    function close(){ ov.style.display='none'; }
    document.getElementById('so-close').onclick = function(){ suppressFor(KEY, 3); close(); };
    document.getElementById('so-skip').onclick = function(){ suppressFor(KEY, 3); close(); };
    document.getElementById('so-cta').onclick = function(){ suppressFor(KEY, 14); };
    ov.addEventListener('click', function(e){ if(e.target===ov){ suppressFor(KEY, 3); close(); } });
    document.addEventListener('keydown', function(e){ if(e.key==='Escape'){ suppressFor(KEY, 3); close(); } });

    suppressFor(KEY, 3); // default cooldown the instant it's shown, in case the visitor navigates away without clicking anything
  }

  /* ── SUMMER PROMO CONFIG ── toggle active:false to turn off sitewide */
  window.LUFA_PROMO = { active: true, pct: 0.15, bundlePct: 0.20, label: 'Big Summer Deal' };
  window.salePrice = function(p, coll){ if(!window.LUFA_PROMO.active) return p; var pct = coll==='bundle' ? window.LUFA_PROMO.bundlePct : window.LUFA_PROMO.pct; return Math.round(p * (1 - pct)); };

  /* ── inject promo into existing topbar ── */
  function setupPromoBar(){
    if(!window.LUFA_PROMO.active) return;
    var tb = document.getElementById('topbar');
    if(!tb) return;
    tb.style.background = '#E82D2D';
    tb.innerHTML =
      '<span>🔥 <strong>Big Summer Deal</strong> — 15% Off All Devices (20% Off Bundles)</span>' +
      '<span class="tb-sep">|</span>' +
      '<span>Add to inquiry list &amp; receive your <strong>discounted quote</strong> within 24 h</span>' +
      '<span class="tb-sep">|</span>' +
      '<span>🚚 Free Shipping on Canada orders CA$300+</span>';
  }

  setupWipBadge();
  setupPromoBar();
  // setupExitIntent(); // disabled
  // Delay the discount popup so it doesn't collide with page render
  setTimeout(setupSoftOpeningPopup, 2500);
})();

