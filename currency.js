/* ── LUFALIGHT CURRENCY SWITCHER ──
   All product prices in the codebase are authored in CAD. This module:
   1. Fetches CAD-based exchange rates from a free API and caches them (refreshed at most every 12h).
   2. Exposes window.lufaFmt(cadAmount) so every page's price formatter can render in the chosen currency.
   3. Renders a small dropdown next to #theme-toggle; switching currency saves the choice and reloads
      the page (simplest way to get every price on the page — modals, cards, tables — to repaint
      consistently across very different per-page rendering code). */
(function(){
  var CURRENCIES = {
    CAD: { symbol:'$', label:'CAD', name:'Canadian Dollar' },
    USD: { symbol:'$', label:'USD', name:'US Dollar' },
    EUR: { symbol:'€', label:'EUR', name:'Euro' },
    GBP: { symbol:'£', label:'GBP', name:'British Pound' },
    AUD: { symbol:'$', label:'AUD', name:'Australian Dollar' }
  };
  var ORDER = ['CAD','USD','EUR','GBP','AUD'];
  var RATES_KEY = 'lufa_fx_rates';
  var RATES_TS_KEY = 'lufa_fx_rates_ts';
  var CUR_KEY = 'lufa_currency';
  var REFRESH_MS = 12*60*60*1000; // 12 hours
  /* Approximate fallback if the API has never been reached yet (e.g. first-ever visit, offline) */
  var FALLBACK_RATES = { CAD:1, USD:0.71, EUR:0.62, GBP:0.53, AUD:1.02 };

  function getCurrency(){
    var c = localStorage.getItem(CUR_KEY);
    return CURRENCIES[c] ? c : 'CAD';
  }
  function getRates(){
    try {
      var r = JSON.parse(localStorage.getItem(RATES_KEY));
      if (r && r.CAD) return r;
    } catch(e){}
    return FALLBACK_RATES;
  }
  function setCurrency(code){
    if (!CURRENCIES[code]) return;
    localStorage.setItem(CUR_KEY, code);
    location.reload();
  }

  /* ── Public formatter — every page's own fmt()/price template should call this ── */
  window.lufaFmt = function(cadAmount){
    var cur = getCurrency();
    var rates = getRates();
    var rate = rates[cur] || 1;
    var info = CURRENCIES[cur];
    var rounded = Math.round(cadAmount * rate);
    return info.symbol + rounded.toLocaleString('en-US') + ' ' + info.label;
  };
  window.lufaCurrency = getCurrency();

  /* Refresh cached rates in the background so the *next* page load/reload is up to date. */
  function refreshRates(){
    var lastTs = parseInt(localStorage.getItem(RATES_TS_KEY), 10) || 0;
    if (Date.now() - lastTs < REFRESH_MS) return;
    fetch('https://open.er-api.com/v6/latest/CAD').then(function(r){ return r.json(); }).then(function(data){
      if (data && data.result === 'success' && data.rates) {
        var rates = { CAD:1, USD:data.rates.USD, EUR:data.rates.EUR, GBP:data.rates.GBP, AUD:data.rates.AUD };
        localStorage.setItem(RATES_KEY, JSON.stringify(rates));
        localStorage.setItem(RATES_TS_KEY, String(Date.now()));
      }
    }).catch(function(){ /* keep using cached/fallback rates */ });
  }
  refreshRates();

  /* ── Dropdown UI, mounted next to #theme-toggle ── */
  function buildUI(){
    var anchor = document.getElementById('theme-toggle');
    if (!anchor || document.getElementById('currency-toggle')) return;

    var css = document.createElement('style');
    css.textContent = `
    #currency-toggle{position:relative;margin-left:8px;flex-shrink:0}
    #currency-btn{background:none;border:1px solid var(--line);color:var(--white);height:38px;padding:0 10px;border-radius:8px;display:flex;align-items:center;gap:5px;font-size:12px;font-weight:700;letter-spacing:.02em;cursor:pointer;transition:border-color .2s,background .2s}
    #currency-btn:hover{border-color:var(--red);background:rgba(232,45,45,.08)}
    #currency-btn .cy-car{font-size:9px;opacity:.6;transition:transform .2s}
    #currency-toggle.open #currency-btn .cy-car{transform:rotate(180deg)}
    #currency-btn .cy-sym{display:none;font-size:14px}
    #currency-menu{position:absolute;top:calc(100% + 8px);right:0;background:var(--card);border:1px solid var(--line);border-radius:10px;box-shadow:0 16px 40px rgba(0,0,0,.25);min-width:170px;padding:6px;display:none;z-index:1100}
    #currency-toggle.open #currency-menu{display:block}
    .cy-opt{display:flex;align-items:center;justify-content:space-between;gap:10px;width:100%;background:none;border:none;color:var(--white);padding:9px 10px;border-radius:7px;cursor:pointer;font-size:12.5px;text-align:left}
    .cy-opt:hover{background:rgba(232,45,45,.08)}
    .cy-opt.active{color:var(--red);font-weight:700}
    .cy-opt .cy-name{color:var(--muted);font-size:11px}
    @media(max-width:860px){#currency-btn{height:34px;padding:0 8px;font-size:11px}nav{gap:6px}}
    @media(max-width:480px){nav{gap:3px;padding-left:12px!important;padding-right:12px!important}.nav-sun{width:28px!important;height:28px!important}.nav-wm{font-size:1.05rem!important}.nav-tl{font-size:.44rem!important}#currency-toggle{margin-left:2px}#currency-btn{height:30px;padding:0 5px;font-size:10px;gap:3px}#currency-btn .cy-car{font-size:7px}}
    @media(max-width:360px){#currency-btn{width:30px;padding:0;justify-content:center}#currency-btn .cy-code,#currency-btn .cy-car{display:none}#currency-btn .cy-sym{display:inline}}
    `;
    document.head.appendChild(css);

    var cur = getCurrency();
    var wrap = document.createElement('div');
    wrap.id = 'currency-toggle';
    wrap.innerHTML = '<button id="currency-btn" aria-haspopup="true" aria-expanded="false"><span class="cy-code">'+cur+'</span><span class="cy-sym">'+CURRENCIES[cur].symbol+'</span> <span class="cy-car">▾</span></button>'+
      '<div id="currency-menu" role="menu">'+
      ORDER.map(function(code){
        var info = CURRENCIES[code];
        return '<button class="cy-opt'+(code===cur?' active':'')+'" data-code="'+code+'" role="menuitem">'+
          '<span>'+info.symbol+' '+code+'</span><span class="cy-name">'+info.name+'</span></button>';
      }).join('')+
      '</div>';
    anchor.parentNode.insertBefore(wrap, anchor);

    var btn = wrap.querySelector('#currency-btn');
    btn.onclick = function(e){
      e.stopPropagation();
      wrap.classList.toggle('open');
      btn.setAttribute('aria-expanded', wrap.classList.contains('open') ? 'true' : 'false');
    };
    wrap.querySelectorAll('.cy-opt').forEach(function(opt){
      opt.onclick = function(){ setCurrency(opt.getAttribute('data-code')); };
    });
    document.addEventListener('click', function(e){
      if (!wrap.contains(e.target)) wrap.classList.remove('open');
    });
    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape') wrap.classList.remove('open');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildUI);
  } else {
    buildUI();
  }
})();
