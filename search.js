/* ── LUFALIGHT PRODUCT SEARCH ── nav search icon + overlay, Kala-style ── */
(function(){
  var PRODUCTS = [
    { id:'EM04', name:'GlowEM04', price:199, img:'images/products/EM04-9.png', coll:'face-skin',
      tags:['sleep','sleep mask','eye mask','mask','face','skin','face & skin','rest','insomnia'] },
    { id:'G15P', name:'BeauMask + BeauNeck-Décolleté', price:599, img:'images/products/G15P-11.png', coll:'face-skin',
      tags:['skin','mask','face mask','face','neck','décolleté','decollete','anti-aging','wrinkle','face & skin'] },
    { id:'G15', name:'BeauMask', price:499, img:'images/products/G15-5.png', coll:'face-skin',
      tags:['skin','mask','face mask','face','acne','clear','blemish','face & skin'] },
    { id:'P40B', name:'RecoverPro40B', price:209, img:'images/products/P40B-3.jpg', coll:'body-recovery',
      tags:['body','recovery','pain','desktop','muscle','body & recovery'] },
    { id:'MINI60PRO', name:'GlowMini60Pro', price:349, img:'images/products/MINI60PRO-1.jpg', coll:'body-recovery',
      tags:['body','pain','relief','portable','handheld','muscle','joint','body & recovery'] },
    { id:'E300', name:'GlowE300', price:499, img:'images/products/E300-1.jpg', coll:'body-recovery',
      tags:['body','mind','clinical','full spectrum','brain','recovery','body & recovery'] },
    { id:'C01', name:'LUMENOVA PRO', price:449, img:'images/products/C01-1.jpg', coll:'specialty',
      tags:['hair','scalp','hair growth','cap','hair loss','specialty'] },
    { id:'G240', name:'AuraDome', price:1199, img:'images/products/G240-1.jpg', coll:'specialty',
      tags:['hair','scalp','hair growth','dome','helmet','hair loss','specialty'] },
    { id:'BK300', name:'Solaris9 BK300 Executive Edition', price:1399, img:'images/products/BK300-1.jpg', coll:'full-body',
      tags:['full body','full-body','panel','full-body panel','uvb','executive','vitiligo','psoriasis'] },
    { id:'MAX1800', name:'LUFAMAX 1800', price:1942, img:'images/products/MAX1800-1.jpg', coll:'full-body',
      tags:['full body','full-body','panel','full-body panel','recovery'] },
    { id:'MAX4800', name:'LUFAMAX 4800', price:4999, img:'images/products/MAX4800-1.jpg', coll:'full-body',
      tags:['full body','full-body','panel','full-body panel','flagship','recovery'] },
    { id:'ESPRO3000', name:'LUFAESPRO 3000', price:5299, img:'images/products/ESPRO3000-1.jpg', coll:'full-body',
      tags:['full body','full-body','panel','full-body panel','clinic','clinical','recovery'] },
    { id:'PE01', name:'VitalityPro PEMF Mat', price:899, img:'images/products/PE01-1.jpg', coll:'accessory',
      tags:['pemf','mat','relief','accessory','magnetic','pain'] },
    { id:'MRS45', name:'ProStand', price:725, img:'images/products/MRS45-1.jpg', coll:'accessory',
      tags:['stand','accessory','mount','adjustable'] }
  ];
  var byId = {};
  PRODUCTS.forEach(function(p){ byId[p.id] = p; });

  var FILTERS = [
    { id:'all', label:'All' },
    { id:'face-skin', label:'✨ Face & Skin' },
    { id:'body-recovery', label:'💪 Body & Recovery' },
    { id:'specialty', label:'⚡ Specialty' },
    { id:'full-body', label:'🌟 Full-Body Panels' },
    { id:'accessory', label:'🔌 Accessories' }
  ];
  var activeFilter = 'all';

  var css = `
  #search-toggle{position:relative;background:none;border:1.5px solid var(--line);color:var(--white);width:40px;height:40px;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;font-size:16px;cursor:pointer;transition:border-color .2s,background .2s;margin-right:4px;flex-shrink:0}
  #search-toggle:hover{border-color:var(--red);background:rgba(232,45,45,.07)}
  @media(max-width:860px){#search-toggle{width:34px;height:34px;font-size:13px;margin-right:2px}}
  @media(max-width:360px){#search-toggle{width:30px;height:30px;font-size:12px;margin-right:0}}
  #search-overlay{position:fixed;inset:0;background:rgba(0,0,0,.55);backdrop-filter:blur(3px);z-index:2100;display:none;align-items:flex-start;justify-content:center;padding:0}
  #search-overlay.open{display:flex}
  #search-panel{background:var(--card);width:100%;max-width:1220px;margin-top:0;border-radius:0 0 var(--r) var(--r);box-shadow:0 24px 60px rgba(0,0,0,.4);max-height:92vh;overflow-y:auto;animation:searchDrop .22s ease}
  @keyframes searchDrop{from{transform:translateY(-16px);opacity:0}to{transform:none;opacity:1}}
  #search-input-row{display:flex;align-items:center;gap:14px;padding:22px 28px;border-bottom:1px solid var(--line)}
  #search-input-row svg{flex-shrink:0;color:var(--muted)}
  #search-input{flex:1;border:none;background:none;outline:none;font-family:var(--bd);font-size:1.15rem;color:var(--white)}
  #search-input::placeholder{color:var(--muted)}
  #search-close{background:rgba(10,10,15,.06);border:none;color:var(--white);width:32px;height:32px;border-radius:50%;font-size:14px;cursor:pointer;flex-shrink:0;display:grid;place-items:center}
  #search-close:hover{background:rgba(10,10,15,.12)}
  #search-filters{display:flex;gap:8px;flex-wrap:wrap;padding:16px 28px 0}
  .sr-filter{background:rgba(10,10,15,.05);border:1px solid var(--line);border-radius:20px;padding:7px 14px;font-size:12px;font-weight:600;color:var(--white);cursor:pointer;transition:all .2s;white-space:nowrap}
  .sr-filter:hover{border-color:var(--red)}
  .sr-filter.active{background:var(--red);border-color:var(--red);color:#fff}
  @media(max-width:480px){#search-filters{padding:14px 18px 0}}
  #search-results{padding:24px 28px 34px}
  #search-results-label{font-size:10.5px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);margin-bottom:16px}
  #search-results-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px}
  @media(max-width:860px){#search-results-grid{grid-template-columns:repeat(2,1fr)}}
  @media(max-width:480px){#search-input-row{padding:18px 18px}#search-results{padding:18px 18px 26px}}
  .sr-card{cursor:pointer;border-radius:var(--r);overflow:hidden;border:1px solid var(--line);background:var(--bg);transition:border-color .2s,transform .2s}
  .sr-card:hover{border-color:rgba(232,45,45,.4);transform:translateY(-3px)}
  .sr-img{aspect-ratio:1;background:#EEEEF1;display:flex;align-items:center;justify-content:center;overflow:hidden}
  .sr-img img{width:100%;height:100%;object-fit:contain;padding:10px}
  .sr-body{padding:12px 14px}
  .sr-name{font-family:var(--hd);font-weight:700;font-size:.88rem;line-height:1.3;margin-bottom:4px}
  .sr-price-row{display:flex;align-items:baseline;gap:6px}
  .sr-price{font-size:12.5px;font-weight:800;color:var(--gold)}
  .sr-price-was{font-size:11px;font-weight:600;color:var(--muted);text-decoration:line-through}
  #search-empty{color:var(--muted);font-size:13px;padding:12px 2px}
  `;
  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  var overlay = document.createElement('div');
  overlay.id = 'search-overlay';
  overlay.innerHTML =
    '<div id="search-panel">' +
      '<div id="search-input-row">' +
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' +
        '<input id="search-input" type="text" placeholder="Search" autocomplete="off"/>' +
        '<button id="search-close" aria-label="Close search">&#10005;</button>' +
      '</div>' +
      '<div id="search-filters">' +
        FILTERS.map(function(f){ return '<button class="sr-filter' + (f.id === 'all' ? ' active' : '') + '" data-filter="' + f.id + '">' + f.label + '</button>'; }).join('') +
      '</div>' +
      '<div id="search-results">' +
        '<div id="search-results-label">Products</div>' +
        '<div id="search-results-grid"></div>' +
        '<div id="search-empty" style="display:none">No products found.</div>' +
      '</div>' +
    '</div>';
  document.body.appendChild(overlay);

  var grid = document.getElementById('search-results-grid');
  var empty = document.getElementById('search-empty');
  var input = document.getElementById('search-input');

  function fmt(n){ return window.lufaFmt ? window.lufaFmt(n) : ('$' + n.toLocaleString('en-CA') + ' CAD'); }
  function priceOf(p){ return window.salePrice ? window.salePrice(p.price) : p.price; }

  function render(list){
    if(!list.length){
      grid.innerHTML = '';
      empty.style.display = 'block';
      return;
    }
    empty.style.display = 'none';
    var onSale = window.LUFA_PROMO && window.LUFA_PROMO.active;
    grid.innerHTML = list.map(function(p){
      var priceHtml = onSale
        ? '<span class="sr-price-was">' + fmt(p.price) + '</span> <span class="sr-price">' + fmt(priceOf(p)) + '</span>'
        : '<span class="sr-price">' + fmt(p.price) + '</span>';
      return '<div class="sr-card" data-sku="' + p.id + '">' +
        '<div class="sr-img"><img src="' + p.img + '" alt="' + p.name + '" loading="lazy"/></div>' +
        '<div class="sr-body"><div class="sr-name">' + p.name + '</div><div class="sr-price-row">' + priceHtml + '</div></div>' +
        '</div>';
    }).join('');
  }

  function byFilter(list){
    if(activeFilter === 'all') return list;
    return list.filter(function(p){ return p.coll === activeFilter; });
  }

  function renderCurrent(){
    var q = input.value.trim().toLowerCase();
    if(!q){
      /* no search text: show every product in the active category ("All" = everything) */
      render(byFilter(PRODUCTS));
      return;
    }
    var words = q.split(/\s+/).filter(Boolean);
    var scored = byFilter(PRODUCTS).map(function(p){
      var name = p.name.toLowerCase(), id = p.id.toLowerCase();
      var tags = p.tags || [];
      var hay = [name, id].concat(tags).join(' ');
      var matches = words.every(function(w){ return hay.indexOf(w) !== -1; });
      if(!matches) return null;
      /* rank: name/id hits first, then tag-only hits */
      var score = (name.indexOf(q) !== -1 || id.indexOf(q) !== -1) ? 0 : 1;
      return { p:p, score:score };
    }).filter(Boolean).sort(function(a,b){ return a.score - b.score; });
    render(scored.map(function(s){ return s.p; }));
  }

  grid.addEventListener('click', function(e){
    var card = e.target.closest('.sr-card');
    if(!card) return;
    window.location.href = 'product.html?sku=' + card.getAttribute('data-sku');
  });

  document.getElementById('search-filters').addEventListener('click', function(e){
    var btn = e.target.closest('.sr-filter');
    if(!btn) return;
    activeFilter = btn.getAttribute('data-filter');
    document.querySelectorAll('.sr-filter').forEach(function(b){ b.classList.toggle('active', b === btn); });
    renderCurrent();
  });

  input.addEventListener('input', renderCurrent);

  function openSearch(){
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    activeFilter = 'all';
    document.querySelectorAll('.sr-filter').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-filter') === 'all'); });
    input.value = '';
    renderCurrent();
    setTimeout(function(){ input.focus(); }, 50);
  }
  function closeSearch(){
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
  window.lufaOpenSearch = openSearch;

  document.getElementById('search-close').addEventListener('click', closeSearch);
  overlay.addEventListener('click', function(e){ if(e.target === overlay) closeSearch(); });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape') closeSearch();
    if((e.key === '/' || (e.key === 'k' && (e.metaKey || e.ctrlKey))) && !overlay.classList.contains('open') && document.activeElement.tagName !== 'INPUT'){
      e.preventDefault(); openSearch();
    }
  });

  /* Search icon button in nav, mounted before #theme-toggle (left of currency/cart) */
  var nav = document.querySelector('nav');
  if(nav){
    var btn = document.createElement('button');
    btn.id = 'search-toggle';
    btn.title = 'Search';
    btn.setAttribute('aria-label', 'Search products');
    btn.innerHTML = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';
    var themeBtn = document.getElementById('theme-toggle');
    if(themeBtn){ nav.insertBefore(btn, themeBtn); } else { nav.appendChild(btn); }
    btn.addEventListener('click', openSearch);
  }
})();
