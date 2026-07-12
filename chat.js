/* ── LUFALIGHT AI CHATBOT ── v2.0 (47-FAQ knowledge base) ── */
(function(){
  var RULES=[
    /* ── GREETINGS ── */
    {k:['^hi','hello','\\bhey\\b','xin ch','bonjour','good morning','good afternoon','good evening','howdy','\\byo\\b','what.*up.*lufa'],
     r:'👋 Hello! Welcome to Lufalight! I\'m here to help with product selection, shipping, warranty, science, and more. Tap a topic or ask me anything!<br><br>Popular topics:'},

    /* ── PRODUCT SELECTION ── */
    {k:['which.*right','which.*best','help.*choose','not sure','recommend','suggest','what should','find.*device','fit'],
     r:'<b>🎯 Find Your Device</b><br>Best by goal:<br>&bull; <b>Skin/wrinkles:</b> <a href="product.html?sku=G15P">G15P</a> ($599) or <a href="product.html?sku=G15">G15</a> ($499)<br>&bull; <b>Pain/recovery:</b> <a href="product.html?sku=P40B">P40B</a> ($209) or <a href="product.html?sku=MINI60PRO">MINI60PRO</a> ($336)<br>&bull; <b>Full-body:</b> <a href="product.html?sku=BK300">BK300</a> (flagship) or <a href="product.html?sku=MAX1800">MAX1800</a><br>&bull; <b>Hair growth:</b> <a href="product.html?sku=C01">HGrowCap C01</a> ($690)<br>&bull; <b>Sleep:</b> <a href="product.html?sku=EM04">SleepGlow EM04</a> ($199)<br><a href="quiz.html">🎯 Take the 60-sec Quiz →</a>'},

    /* ── WHAT IS RED LIGHT THERAPY ── */
    {k:['what is red light','what is pbm','photobiomodulation','how does.*work','how.*light.*work','how it works','how.*work','red light therapy'],
     r:'<b>🔬 Red Light Therapy (PBM)</b><br>Red & near-infrared light stimulates mitochondria → boosts ATP (cellular energy), reduces inflammation, promotes tissue repair & improves circulation — with no heat or UV.<br>Clinically studied at 630–1060nm wavelengths. 30+ peer-reviewed studies.<br><a href="index.html#science">Read the Science →</a>'},

    /* ── RED vs NIR ── */
    {k:['red.*infrared','infrared.*red','660.*850','nir','near.infrared','wavelength.*differ','differ.*wavelength'],
     r:'<b>💡 Red vs Near-Infrared (NIR)</b><br>&bull; <b>Red (630–660nm):</b> skin surface — collagen, skin rejuvenation, acne<br>&bull; <b>NIR (810–1060nm):</b> deeper penetration — muscles, joints, bone recovery<br>Most LUFALIGHT devices combine both for maximum benefit.'},

    /* ── WAVELENGTHS ── */
    {k:['wavelength','nanometer','nm','irradiance','mw/cm','penetrat','how deep'],
     r:'<b>📡 Wavelengths & Penetration</b><br>&bull; 660nm → 2–3mm (skin surface)<br>&bull; 810–850nm → 5–10mm (muscle & joint)<br>&bull; 1060nm (BK300 exclusive) → 10mm+ (deep tissue)<br>BK300 publishes 150 mW/cm² irradiance — among highest in class.'},

    /* ── BK300 SPECIFIC ── */
    {k:['bk300','bioshield','flagship','uvb','1060','ultra.deep','immune'],
     r:'<b>🛡️ BioShield BK300 — Flagship</b><br>Only device in its class with:<br>&bull; Dual UVB (295nm + 311nm certified)<br>&bull; 1060nm Ultra-Deep NIR (exclusive to LUFALIGHT)<br>&bull; 150 mW/cm² irradiance<br>&bull; FDA-Cleared 510(k) + ISO 13485 + IEC 60601<br>No competitor offers this wavelength combination at any price.<br><a href="product.html?sku=BK300">BK300 Details →</a>'},

    /* ── SAFETY ── */
    {k:['safe','danger','side effect','risk','uv radiation','pregnant','photosensit'],
     r:'<b>✅ Safety</b><br>Red light therapy is non-thermal, non-invasive, and emits zero UV radiation (except BK300\'s controlled UVB). Generally safe for all adults.<br><br>⚠️ Consult your doctor if you: are pregnant, have photosensitive conditions, or take photosensitizing medication.<br>Always wear provided eye protection during facial sessions.'},

    /* ── FDA / CERTIFICATIONS ── */
    {k:['fda','certified','certification','iso 13485','iec 60601','510.*k','cleared','approved','medical grade'],
     r:'<b>🏅 Certifications</b><br>&bull; <b>FDA-Cleared 510(k)</b> (BK300) — rigorous premarket review, not just registration<br>&bull; <b>ISO 13485</b> — international medical device quality management standard<br>&bull; <b>IEC 60601</b> — medical electrical safety standard<br>All LUFALIGHT devices manufactured in ISO 13485 facilities.'},

    /* ── SCIENCE / CLINICAL EVIDENCE ── */
    {k:['science','clinical','stud','research','proof','proven','evidence','pbm','peer.review','journal'],
     r:'<b>🔬 Clinical Evidence</b><br>PBM is supported by 30+ peer-reviewed studies in journals like <em>Photobiomodulation, Photomedicine & Laser Surgery</em>.<br>Clinically studied uses: skin rejuvenation, acne, muscle recovery, joint pain, hair growth, sleep improvement, mental focus, inflammation reduction.<br><a href="index.html#science">See Studies →</a>'},

    /* ── SESSION DURATION / FREQUENCY ── */
    {k:['how long.*session','session.*long','how often','frequency','minutes','daily','how.*use'],
     r:'<b>⏱️ Session Guide</b><br>Typical sessions: <b>10–20 minutes per area</b>. Most goals: daily or every-other-day use.<br>Your device manual includes evidence-based protocol schedules. You can also use multiple devices simultaneously — just stay within recommended limits per device.'},

    /* ── SKIN / FACE ── */
    {k:['skin','face','collagen','wrinkle','anti.ag','glow','brighten','fine line','rejuven'],
     r:'<b>✨ Skin & Face</b><br>&bull; <a href="product.html?sku=G15P">BeauMask + BeauNeck-Décolleté</a> — $599 — Face + Neck (660nm Red + NIR)<br>&bull; <a href="product.html?sku=G15">BeauMask</a> — $499 — Full face (415nm Blue + 660nm Red)<br>&bull; <a href="product.html?sku=EM04">GlowEM04 SleepGlow</a> — $199 — Eye area + sleep support'},

    /* ── SLEEP ── */
    {k:['sleep','insomnia','melatonin','relax','rest','bedtime'],
     r:'<b>😴 Sleep Support</b><br>&bull; <a href="product.html?sku=EM04">GlowEM04 SleepGlow Eye Mask</a> — $199<br>630nm red light supports natural melatonin production for deeper sleep. Wireless + 20-min auto-off timer. Use 20 min before bed.'},

    /* ── PAIN / RECOVERY ── */
    {k:['pain','recover','recovery','muscle','joint','injur','ache','sore','back','arthrit','inflam'],
     r:'<b>💪 Pain & Recovery</b><br>&bull; <a href="product.html?sku=P40B">RecoverPro40B</a> — $209 (desktop, 40 LEDs)<br>&bull; <a href="product.html?sku=MINI60PRO">Glow60MiniPro</a> — $336 (handheld, targeted relief)<br>&bull; <a href="product.html?sku=PE01">VitalityPro PEMF Mat</a> — $899 (full-body + PEMF)<br>&bull; <a href="product.html?sku=BUNDLE-RECOVERY">Recovery Bundle</a> — $479 (save $66)'},

    /* ── HAIR GROWTH ── */
    {k:['hair','grow','growth','bald','scalp','alopec','thinning'],
     r:'<b>💇 Hair Growth</b><br>&bull; <a href="product.html?sku=C01">LUMENOVA PRO</a> — $499 — Laser+LED cap, 660nm + 830nm for follicle stimulation<br>&bull; <a href="product.html?sku=G240">AuraDome</a> — $1,199 — Hands-free dome for head & face<br>Supports +39% hair density based on PBM research.'},

    /* ── ACNE / CLEAR SKIN ── */
    {k:['acne','clear.*skin','breakout','pimple','sebum','blemish'],
     r:'<b>🌿 Acne & Clear Skin</b><br>&bull; <a href="product.html?sku=G15">G15 ClearGlow Face Mask</a> — $499<br>415nm Blue targets acne bacteria + 630nm Red reduces inflammation. Clinically studied: -76% acne reduction.'},

    /* ── BRAIN / MENTAL ── */
    {k:['brain','focus','mental','cognitive','memory','fog','e300'],
     r:'<b>🧠 Brain Performance</b><br>&bull; <a href="product.html?sku=E300">GlowE300</a> — $415<br>810 · 830 · 1064nm NIR — supports cerebral circulation and mental focus. LCD timer + adjustable stand.'},

    /* ── FULL BODY PANELS ── */
    {k:['full.body','max1800','max4800','espro','panel','1800','4800','full body'],
     r:'<b>🏋️ Full-Body Panels</b><br>&bull; <a href="product.html?sku=MAX1800">LUFAMAX 1800</a> — $1,942<br>&bull; <a href="product.html?sku=MAX4800">LUFAMAX 4800</a> — $4,999 (head-to-toe, 1832mm)<br>&bull; <a href="product.html?sku=ESPRO3000">LUFAESPRO 3000</a> — $5,299 (clinic-grade, 6 wavelengths)<br>&bull; <a href="product.html?sku=BK300">Solaris9 BK300 Executive Edition</a> — $1,399 (flagship + UVB)'},

    /* ── SHIPPING ── */
    {k:['ship','deliver','how long','arrival','arrive','track','when.*get','us.*ship','canada.*ship'],
     r:'<b>🚚 Shipping</b><br>Free standard shipping to <b>Canada &amp; the USA</b> — no minimum order.<br>&bull; Processing: 1–2 business days<br>&bull; Delivery: 7–14 business days (remote areas +3–5 days)<br>A tracking number is emailed when your order ships. We ship to all 50 US states and all Canadian provinces.<br><a href="shipping-returns.html">Shipping Details →</a>'},

    /* ── FREE SHIPPING ── */
    {k:['free.*ship','ship.*free','ship.*cost','how much.*ship'],
     r:'<b>🚚 Free Shipping</b><br>Free standard shipping to <b>Canada &amp; the USA</b> — no minimum order. Tracking is emailed when your order ships.<br><a href="shipping-returns.html">Shipping &amp; Returns →</a>'},

    /* ── RETURNS ── */
    {k:['return','refund','exchange','money.?back','60.day','30.day','restock','satisfaction','not happy','try'],
     r:'<b>↩️ 30–60 Day Free-Trial Returns</b><br>Not satisfied? Return within your device\'s trial window for a full refund of the purchase price — <b>no restocking fee</b>. Most devices (GlowEM04, RecoverPro40B, LUMENOVA PRO, VitalityPro PEMF Mat, ProStand, GlowE300, Glow60MiniPro, BeauMask, BeauMask+BeauNeck-Décolleté, AuraDome) get <b>30 days</b>; our largest full-body panels (LUFAMAX 1800, LUFAMAX 4800, LUFAESPRO 3000) and the Solaris9 BK300 Executive Edition get <b>60 days</b>. Device must be in like-new condition and original packaging with all accessories. (Return shipping is the customer\'s responsibility for change-of-mind returns; we cover it if the item is defective, damaged in transit, or incorrect.)<br>Email: <a href="mailto:lufalight@gmail.com">lufalight@gmail.com</a> to start.<br><a href="shipping-returns.html">Full Return Policy →</a>'},

    /* ── WARRANTY ── */
    {k:['warrant','guarantee','broken','defect','cover','repair','replace'],
     r:'<b>🛡️ Warranty</b><br>Warranty by device:<br>&bull; <b>2-Year:</b> GlowE300, LUFAMAX 1800, LUFAMAX 4800, LUFAESPRO 3000, Solaris9 BK300 Executive Edition<br>&bull; <b>1-Year:</b> all other models (BeauMask+BeauNeck, BeauMask, RecoverPro40B, GlowEM04, Glow60MiniPro, LUMENOVA PRO, AuraDome, VitalityPro PEMF Mat, ProStand)<br><br>Covers manufacturing defects. Claim: email <a href="mailto:lufalight@gmail.com">lufalight@gmail.com</a> with order # + photos.<br><a href="warranty.html">Full Warranty →</a>'},

    /* ── WARRANTY CLAIM ── */
    {k:['claim.*warrant','warrant.*claim','how.*warrant','broken.*what','not work','not turn'],
     r:'<b>🛡️ Warranty Claim</b><br>1. Email <a href="mailto:lufalight@gmail.com">lufalight@gmail.com</a> with order number + photos/video<br>2. Team responds within 2 business days<br>3. If valid: prepaid return label sent (Canada & USA)<br>4. Replacement/repair shipped within 5–10 business days<br><br>⚡ First: check power connection, try different outlet, re-seat the adapter.'},

    /* ── SHIPPING DAMAGE ── */
    {k:['damage.*ship','ship.*damage','arrived.*broken','package.*damage'],
     r:'<b>📦 Shipping Damage</b><br>Document damage immediately with photos (outer box + device). Contact us within <b>48 hours</b> at <a href="mailto:lufalight@gmail.com">lufalight@gmail.com</a>. We\'ll file a carrier claim and send a replacement at no cost.'},

    /* ── ORDER / CANCEL ── */
    {k:['order','cancel','modif','change.*order','cancel.*order'],
     r:'<b>📋 Orders</b><br>Orders can be modified or cancelled within <b>24 hours</b> of placement. After 24 hours it may already be in fulfillment. Contact <a href="mailto:lufalight@gmail.com">lufalight@gmail.com</a> ASAP.<br><br>To place an order: browse products → add to cart → checkout (Visa, MC, Amex, PayPal accepted).'},

    /* ── PAYMENT ── */
    {k:['pay','payment','paypal','stripe','card','credit','debit','apple pay','google pay','currency','cad','dollar'],
     r:'<b>💳 Payment</b><br>We accept Visa, Mastercard, Amex, Apple Pay, Google Pay, and PayPal. All prices in <b>CA$ (Canadian Dollars)</b>. International customers see local currency equivalent at checkout.<br>All transactions SSL-encrypted & PCI-DSS compliant — card details never stored on our servers.'},

    /* ── FINANCING ── */
    {k:['financ','afterpay','affirm','pay later','installment','monthly','split'],
     r:'<b>💳 Financing</b><br>We are working on integrating Afterpay/Affirm buy-now-pay-later options. Check our website or contact <a href="mailto:lufalight@gmail.com">lufalight@gmail.com</a> for latest availability.'},

    /* ── CUSTOMS / DUTIES ── */
    {k:['custom','duty','duties','import','tax.*us','border'],
     r:'<b>🌎 Customs & Duties</b><br>&bull; <b>Canada:</b> no import duties<br>&bull; <b>USA:</b> orders are generally below US de minimis thresholds — however we recommend checking USPS/CBP guidelines for large orders. Any applicable duties are the buyer\'s responsibility.'},

    /* ── COMPETITOR: JOOVV ── */
    {k:['joovv'],
     r:'<b>⚖️ vs Joovv</b><br>LUFALIGHT matches or exceeds Joovv specifications at 20–30% lower retail price. The BK300 offers 1060nm NIR + dual UVB therapy — features Joovv does not carry at any price. All key certifications (FDA, ISO 13485, IEC 60601) matched or exceeded.'},

    /* ── COMPETITOR: MITO RED ── */
    {k:['mito red','mito light'],
     r:'<b>⚖️ vs Mito Red Light</b><br>LUFALIGHT matches Mito Red\'s core specs and certifications at a competitive price. LUFALIGHT differentiates with the exclusive 1060nm Ultra-Deep NIR and dual certified UVB (BK300) — features Mito Red does not offer.'},

    /* ── COMPETITOR: PLATINUMLED / OMNILUX / IRESTORE ── */
    {k:['platinum','biomax','omnilux','irestore','irestore','competitor','compar','vs '],
     r:'<b>⚖️ LUFALIGHT vs Competitors</b><br>LUFALIGHT matches core specs of PlatinumLED BioMax, Omnilux, and iRestore — while offering unique advantages: 1060nm Ultra-Deep NIR + dual certified UVB (BK300 only) at competitive pricing.<br>Ask me which specific brand you\'d like to compare!'},

    /* ── WHY BUY DIRECT / AMAZON ── */
    {k:['amazon','third.party','resell','authentic','counterfeit','fake','buy.*direct','where.*buy'],
     r:'<b>🛒 Buy Direct from lufalight.com</b><br>Direct purchase guarantees:<br>&bull; Genuine, warranty-covered products<br>&bull; Full 1–2 year warranty protection<br>&bull; Direct manufacturer support<br>&bull; Certified authenticity<br>Amazon third-party sellers may carry grey-market units without warranty coverage.'},

    /* ── MADE IN CANADA ── */
    {k:['made in','canada.*made','canadian','where.*manufactur','origin'],
     r:'<b>🇨🇦 About LUFALIGHT</b><br>LUFALIGHT is a Canadian brand headquartered in Canada. Devices are manufactured to ISO 13485 and IEC 60601 medical-grade standards. Full specifications and certifications listed on each product page.'},

    /* ── MULTIPLE DEVICES ── */
    {k:['multiple','two.*device','combine','same time','together.*device'],
     r:'<b>🔀 Using Multiple Devices</b><br>Yes — many users combine devices (e.g., SleepGlow Eye Mask during a full-body panel session). Keep total session times within recommended limits per each device\'s protocol guide.'},

    /* ── DEVICE REGISTRATION ── */
    {k:['register','serial','registrat'],
     r:'<b>📝 Device Registration</b><br>Optional but recommended. Register at <b>lufalight.com/register</b> with your order number and device serial number to ensure fastest warranty processing and receive any updates.'},

    /* ── REPLACEMENT PARTS ── */
    {k:['part','accessory','accessories','replace.*part','adapter','strap','stand.*replace','spare'],
     r:'<b>🔧 Replacement Parts</b><br>Replacement stands, power adapters, eye protection and straps are available. Contact <a href="mailto:lufalight@gmail.com">lufalight@gmail.com</a> or check the Accessories section on our website.'},

    /* ── WHOLESALE ── */
    {k:['wholesale','bulk','clinic','spa','business','partner','b2b','gym','physiother'],
     r:'<b>🤝 Wholesale / B2B</b><br>Volume pricing for licensed clinics, spas, physiotherapy centers, and wellness studios. Email <a href="mailto:lufalight@gmail.com">lufalight@gmail.com</a> for a custom quote.<br><a href="wholesale.html">Wholesale Page →</a>'},

    /* ── PRICE / BUDGET ── */
    {k:['price','cost','how much','budget','afford','cheap','expens'],
     r:'<b>💰 Pricing</b><br>&bull; Entry: $199 (GlowEM04 Eye Mask)<br>&bull; Mid: $209–$599 (RecoverPro40B, Glow60MiniPro, BeauMask, BeauMask+BeauNeck)<br>&bull; Pro: $499–$1,399 (LUMENOVA PRO, AuraDome, Solaris9 BK300)<br>&bull; Clinic: $1,942–$5,299 (LUFAMAX 1800, LUFAMAX 4800, LUFAESPRO 3000)<br>&bull; Bundles from $479 (save up to $268)<br><a href="shop-all.html">Browse All →</a>'},

    /* ── BUNDLES ── */
    {k:['bundle','combo','package','save','deal','kit'],
     r:'<b>🎁 Bundles & Save</b><br>&bull; <a href="product.html?sku=BUNDLE-RECOVERY">Recovery Essentials</a> — $479 (save $66)<br>&bull; <a href="product.html?sku=BUNDLE-GLOW">Glow & Restore</a> — $699 (save $99)<br>&bull; <a href="product.html?sku=BUNDLE-FULLBODY">Full-Body Recovery</a> — $2,399 (save $268)'},

    /* ── QUIZ ── */
    {k:['quiz','finder','60.sec','find my','which is right','which one','tool'],
     r:'<b>🎯 Product Finder Quiz</b><br>Answer 5 quick questions and get a personalised device recommendation in 60 seconds!<br><a href="quiz.html">Take the Quiz →</a>'},

    /* ── CONTACT ── */
    {k:['contact','email','phone','call','human','speak','agent','support','help'],
     r:'<b>📞 Contact Lufalight</b><br>📧 <a href="mailto:lufalight@gmail.com">lufalight@gmail.com</a><br>🏢 B2B/Wholesale: <a href="mailto:lufalight@gmail.com">lufalight@gmail.com</a><br>🛡️ Warranty: <a href="mailto:lufalight@gmail.com">lufalight@gmail.com</a><br>Hours: Mon–Fri 9am–5pm PST/EST. Replies within a few hours.'}
  ];

  var HELLO="👋 Hi! I'm the Lufalight assistant — trained on 47 FAQs. Ask me anything or tap a topic:";
  var QBS=['🔬 How it works','🎯 Find my device','✨ Skin & Face','💪 Recovery','😴 Sleep','💇 Hair Growth','🛡️ Warranty','↩️ Returns','🚚 Shipping','💰 Pricing'];

  function addMsg(html,side){
    var msgs=document.getElementById('chatMsgs');if(!msgs)return;
    var row=document.createElement('div');row.className=side==='user'?'msg-row-user':'msg-row-bot';
    var b=document.createElement('div');b.className=side==='user'?'msg-user':'msg-bot';
    if(side==='user')b.textContent=html;else b.innerHTML=html;
    row.appendChild(b);msgs.appendChild(row);msgs.scrollTop=msgs.scrollHeight;
  }
  function addQBs(labels){
    var msgs=document.getElementById('chatMsgs');
    var row=document.createElement('div');row.className='msg-row-bot';
    var wrap=document.createElement('div');wrap.className='msg-bot chat-qbs';
    labels.forEach(function(lbl){
      var btn=document.createElement('button');btn.className='chat-qb';btn.textContent=lbl;
      btn.onclick=function(){addMsg(lbl,'user');botReply(lbl);};
      wrap.appendChild(btn);
    });
    row.appendChild(wrap);msgs.appendChild(row);msgs.scrollTop=msgs.scrollHeight;
  }
  function botReply(text){
    var q=text.toLowerCase();
    for(var i=0;i<RULES.length;i++){
      var rule=RULES[i];
      var keys=Array.isArray(rule.k)?rule.k:[rule.k];
      for(var j=0;j<keys.length;j++){
        if(new RegExp(keys[j]).test(q)){
          var r=rule.r;
          setTimeout(function(reply){addMsg(reply,'bot');},350,r);return;
        }
      }
    }
    setTimeout(function(){
      addMsg('Not sure about that — reach our team directly:<br>📧 <a href="mailto:lufalight@gmail.com">lufalight@gmail.com</a>','bot');
    },350);
  }
  function sendChatMsg(){
    var inp=document.getElementById('chatInp');if(!inp)return;
    var val=inp.value.trim();if(!val)return;
    addMsg(val,'user');inp.value='';botReply(val);
  }
  window.sendChatMsg=sendChatMsg;
  var inited=false;
  var fab=document.getElementById('chat-fab');
  if(fab){
    fab.addEventListener('click',function(){
      if(!inited){inited=true;addMsg(HELLO,'bot');addQBs(QBS);}
    });
  }
  document.addEventListener('click',function(e){
    var panel=document.getElementById('chat-panel');
    var fabEl=document.getElementById('chat-fab');
    if(panel&&fabEl&&panel.classList.contains('open')&&!panel.contains(e.target)&&!fabEl.contains(e.target)){
      panel.classList.remove('open');
    }
  });
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'){var panel=document.getElementById('chat-panel');if(panel)panel.classList.remove('open');}
  });
})();
