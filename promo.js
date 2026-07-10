/* ── LUFALIGHT PROMO WIDGETS ── Social Proof Ticker + Exit Intent Popup ── */
(function(){
  /* inject self-contained CSS */
  var css = `
  #sp-toast{position:fixed;left:22px;bottom:96px;z-index:850;background:#FFFFFF;border:1px solid rgba(0,0,0,.08);border-radius:12px;padding:13px 16px;display:flex;align-items:center;gap:11px;max-width:300px;box-shadow:0 16px 40px rgba(0,0,0,.14);transform:translateY(16px) scale(.96);opacity:0;pointer-events:none;transition:transform .35s,opacity .35s;font-family:"Plus Jakarta Sans",sans-serif}
  #sp-toast.show{transform:none;opacity:1}
  .sp-ic{font-size:22px;line-height:1;flex-shrink:0}
  .sp-txt{font-size:12px;color:#14151A;line-height:1.5}
  .sp-txt b{color:#000}
  .sp-time{font-size:10.5px;color:#5C606B;margin-top:2px}
  @media(max-width:480px){#sp-toast{left:14px;right:14px;max-width:none;bottom:88px}}

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

  /* ── SOCIAL PROOF TICKER ── */
  var NOTIFS = [
    {n:'Sarah M.',l:'Toronto, ON',p:'G15P ClearGlow Pro',t:'2 minutes ago'},
    {n:'David C.',l:'Winnipeg, MB',p:'EM04 SleepGlow Eye Mask',t:'4 minutes ago'},
    {n:'Mike T.',l:'Saskatoon, SK',p:'P40B RecoverPro Panel',t:'6 minutes ago'},
    {n:'Linh T.',l:'Vancouver, BC',p:'G15P ClearGlow Pro',t:'8 minutes ago'},
    {n:'Brian C.',l:'Toronto, ON',p:'C01 HGrowCap Pro',t:'11 minutes ago'},
    {n:'Angie W.',l:'Calgary, AB',p:'BK300 BioShield Standee',t:'13 minutes ago'},
    {n:'Olivia S.',l:'London, ON',p:'Recovery Essentials Bundle',t:'15 minutes ago'},
    {n:'Kim L.',l:'Edmonton, AB',p:'G15 ClearGlow Face Mask',t:'18 minutes ago'},
    {n:'James O.',l:'Oakville, ON',p:'MAX1800 BodyMax Panel',t:'21 minutes ago'},
    {n:'Tina S.',l:'Vancouver, BC',p:'Glow & Restore Bundle',t:'24 minutes ago'},
    {n:'Karen M.',l:'Ottawa, ON',p:'P40B RecoverPro Panel',t:'27 minutes ago'},
    {n:'Nina C.',l:'Toronto, ON',p:'G240 AuraDome',t:'30 minutes ago'},
    {n:'Lucy T.',l:'Victoria, BC',p:'PE01 ZenField PEMF Mat',t:'33 minutes ago'},
    {n:'Raj K.',l:'Calgary, AB',p:'BK300 BioShield Standee',t:'37 minutes ago'},
    {n:'Mia R.',l:'Toronto, ON',p:'EM04 SleepGlow Eye Mask',t:'41 minutes ago'},
    {n:'Theresa G.',l:'Kelowna, BC',p:'MINI60PRO PainRelief Mini',t:'45 minutes ago'},
    {n:'Catherine M.',l:'Montréal, QC',p:'Glow & Restore Bundle',t:'49 minutes ago'},
    {n:'Derek H.',l:'Edmonton, AB',p:'Full-Body Recovery Bundle',t:'53 minutes ago'},
    {n:'Amanda K.',l:'Calgary, AB',p:'G15P ClearGlow Pro',t:'57 minutes ago'},
    {n:'Robert F.',l:'Ottawa, ON',p:'MRS45 ProStand',t:'1 hour ago'},
  ];

  function buildToast(){
    var t = document.createElement('div');
    t.id = 'sp-toast';
    t.innerHTML = '<div class="sp-ic">☀️</div><div><div class="sp-txt"></div><div class="sp-time"></div></div>';
    document.body.appendChild(t);
    return t;
  }

  function startTicker(){
    if(document.getElementById('chat-fab')===null) return; // only on shop pages with chat widget present
    var toast = buildToast();
    var txt = toast.querySelector('.sp-txt');
    var time = toast.querySelector('.sp-time');
    var idx = Math.floor(Math.random()*NOTIFS.length);
    function showNext(){
      var item = NOTIFS[idx % NOTIFS.length];
      idx++;
      txt.innerHTML = '<b>'+item.n+'</b> from '+item.l+' just ordered<br><b>'+item.p+'</b>';
      time.textContent = item.t;
      toast.classList.add('show');
      setTimeout(function(){ toast.classList.remove('show'); }, 5500);
    }
    setTimeout(function(){
      showNext();
      setInterval(showNext, 18000);
    }, 4000);
  }

  /* ── EXIT INTENT POPUP ── */
  function buildExitPopup(){
    var ov = document.createElement('div');
    ov.id = 'ei-ov';
    ov.innerHTML = '<div id="ei-card">'+
      '<button id="ei-close" aria-label="Close">✕</button>'+
      '<div class="ei-ic">🎁</div>'+
      '<h3>Wait — Don\'t Miss 10% Off!</h3>'+
      '<p>Get <b>10% off</b> your first Lufalight order. Use this code at checkout — limited time only.</p>'+
      '<div id="ei-code"><span>WELCOME10</span><button id="ei-copy">Copy</button></div>'+
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
        navigator.clipboard && navigator.clipboard.writeText('WELCOME10');
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

  /* ── SOFT OPENING POPUP ── */
  function setupSoftOpeningPopup(){
    var KEY = 'lufa_soft_shown';
    if(sessionStorage.getItem(KEY)) return;

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
      '<div id="so-badge">Soft Opening Special</div>' +
      '<h2>Up to <span>40% Off</span><br>All Products</h2>' +
      '<p>We\'re officially open! Celebrate with us — enjoy up to <strong>40% off</strong> our full range of red light therapy devices. Limited-time offer for early supporters.</p>' +
      '<a id="so-cta" href="shop-all.html">Shop All Deals &rarr;</a>' +
      '<button id="so-skip">Maybe later</button>' +
      '</div>';
    document.body.appendChild(ov);

    function close(){ ov.style.display='none'; }
    document.getElementById('so-close').onclick = close;
    document.getElementById('so-skip').onclick = close;
    ov.addEventListener('click', function(e){ if(e.target===ov) close(); });
    document.addEventListener('keydown', function(e){ if(e.key==='Escape') close(); });

    sessionStorage.setItem(KEY,'1');
  }

  startTicker();
  setupExitIntent();
  // Delay soft opening popup so it doesn't collide with page render
  setTimeout(setupSoftOpeningPopup, 1800);
})();
