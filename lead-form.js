/* ── LUFALIGHT LEAD CAPTURE FORM ── replaces cart/checkout — no payment processing yet ── */
(function(){
  var FORMSPREE_URL = 'https://formspree.io/f/mwvdlyky';

  var css = `
  #lead-ov{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:1300;display:none;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px);font-family:"Plus Jakarta Sans",sans-serif}
  #lead-ov.open{display:flex}
  #lead-modal{background:#FFFFFF;border:1px solid rgba(0,0,0,.08);box-shadow:0 24px 60px rgba(0,0,0,.18);border-radius:18px;padding:32px 30px;max-width:440px;width:100%;max-height:92vh;overflow-y:auto;position:relative;animation:leadPop .3s ease}
  @keyframes leadPop{from{transform:scale(.92);opacity:0}to{transform:none;opacity:1}}
  #lead-x{position:absolute;top:14px;right:14px;background:rgba(0,0,0,.06);border:none;color:#14151A;width:30px;height:30px;border-radius:50%;font-size:14px;cursor:pointer}
  #lead-x:hover{background:#E82D2D;color:#fff}
  .lead-ic{font-size:34px;margin-bottom:10px}
  #lead-modal h3{font-family:"Inter Tight",sans-serif;font-size:1.3rem;font-weight:800;color:#14151A;margin-bottom:6px}
  .lead-sub{font-size:12.5px;color:#5C606B;line-height:1.6;margin-bottom:20px}
  .lead-sub b{color:#14151A}
  .lead-field{margin-bottom:14px}
  .lead-field label{display:block;font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#5C606B;margin-bottom:6px}
  .lead-field input,.lead-field select,.lead-field textarea{width:100%;background:#FAFAFB;border:1px solid rgba(0,0,0,.12);color:#14151A;font-size:13.5px;padding:11px 13px;border-radius:8px;font-family:"Plus Jakarta Sans",sans-serif;outline:none}
  .lead-field select{color-scheme:light}
  .lead-field select option{background:#FFFFFF;color:#14151A}
  .lead-field input:focus,.lead-field select:focus,.lead-field textarea:focus{border-color:#E82D2D}
  .lead-field input.lead-err,.lead-field select.lead-err{border-color:#E82D2D}
  .lead-field textarea{resize:vertical;min-height:64px}
  .lead-hint{font-size:10.5px;color:#5C606B;margin-top:5px}
  .lead-product-pill{display:inline-flex;align-items:center;gap:8px;background:rgba(232,45,45,.08);border:1px solid rgba(232,45,45,.25);border-radius:9px;padding:9px 13px;font-size:12.5px;font-weight:700;color:#14151A;margin-bottom:18px}
  #leadSubmitBtn{width:100%;background:#E82D2D;color:#fff;font-size:13px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;padding:14px;border-radius:8px;border:none;cursor:pointer;transition:background .2s,transform .2s;margin-top:4px}
  #leadSubmitBtn:hover{background:#F05555;transform:translateY(-1px)}
  #leadSubmitBtn:disabled{opacity:.6;cursor:not-allowed}
  .lead-privacy{font-size:10.5px;color:#5C606B;text-align:center;margin-top:12px;line-height:1.5}
  #leadSuccess{display:none;text-align:center;padding:20px 0}
  #leadSuccess .ok-ic{font-size:46px;margin-bottom:14px}
  #leadSuccess h3{margin-bottom:8px}
  #leadSuccess p{font-size:13px;color:#5C606B;line-height:1.6}
  #leadError{display:none;background:rgba(232,45,45,.08);border:1px solid rgba(232,45,45,.3);border-radius:8px;padding:10px 13px;font-size:12px;color:#C91F1F;margin-bottom:14px}
  /* Primary purchase CTA — backend checkout (checkout.js) */
  .lufa-buy-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;background:#E82D2D;color:#fff;font-size:13px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;padding:14px 24px;border-radius:7px;border:none;cursor:pointer;transition:background .2s,transform .2s;white-space:nowrap}
  .lufa-buy-btn:hover{background:#F05555;transform:translateY(-2px)}
  /* Secondary CTA — lead-capture (pre-sale questions) */
  .lufa-interest-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;background:transparent;color:#14151A;font-size:13px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;padding:13px 23px;border-radius:7px;border:1.5px solid rgba(20,21,26,.18);cursor:pointer;transition:all .2s;white-space:nowrap}
  .lufa-interest-btn:hover{border-color:#E82D2D;background:rgba(232,45,45,.06)}
  `;
  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  var ov = document.createElement('div');
  ov.id = 'lead-ov';
  ov.innerHTML = `
    <div id="lead-modal">
      <button id="lead-x" aria-label="Close">✕</button>
      <div class="lead-ic">☀️</div>
      <h3>Interested in this product?</h3>
      <p class="lead-sub">Leave your info and the <b>Lufalight</b> team will reach out with a free consultation within 24 hours — no payment required.</p>
      <div id="leadProductPill" class="lead-product-pill" style="display:none">🛍️ <span id="leadProductName"></span></div>
      <div id="leadError">⚠️ Something went wrong. Please try again or email us directly at support@lufalight.com</div>
      <form id="leadForm">
        <input type="hidden" name="product" id="leadProductField" value=""/>
        <input type="hidden" name="_subject" id="leadSubjectField" value="Lufalight — New Lead"/>
        <div class="lead-field"><label>Full Name *</label><input type="text" name="name" id="leadName" required/></div>
        <div class="lead-field"><label>Email</label><input type="email" name="email" id="leadEmail"/></div>
        <div class="lead-field"><label>Phone Number</label><input type="tel" name="phone" id="leadPhone"/>
          <div class="lead-hint">Please provide at least one — email or phone.</div>
        </div>
        <div class="lead-field">
          <label>Area / Goal You'd Like to Improve</label>
          <select name="goal">
            <option value="">— Select a goal —</option>
            <option>Skin / Anti-Aging</option>
            <option>Sleep</option>
            <option>Pain Relief / Joint Recovery</option>
            <option>Hair Growth</option>
            <option>Full Body / Athletic Recovery</option>
            <option>Other</option>
          </select>
        </div>
        <div class="lead-field"><label>Additional Notes (optional)</label><textarea name="message" placeholder="Your question or specific request..."></textarea></div>
        <button type="submit" id="leadSubmitBtn">Submit →</button>
        <p class="lead-privacy">Your information is only used for consultation purposes and is never shared with third parties.</p>
      </form>
      <div id="leadSuccess">
        <div class="ok-ic">✅</div>
        <h3>Successfully Submitted!</h3>
        <p>Thank you for your interest. Our Lufalight team will be in touch within 24 hours.</p>
      </div>
    </div>
  `;
  document.body.appendChild(ov);

  function openLead(productName){
    var pill = document.getElementById('leadProductPill');
    var nameEl = document.getElementById('leadProductName');
    var field = document.getElementById('leadProductField');
    var subjectField = document.getElementById('leadSubjectField');
    if(productName){
      pill.style.display = 'inline-flex';
      nameEl.textContent = productName;
      field.value = productName;
      subjectField.value = 'Lufalight — New Lead: ' + productName;
    } else {
      pill.style.display = 'none';
      field.value = '';
      subjectField.value = 'Lufalight — New Lead (General Inquiry)';
    }
    document.getElementById('leadForm').style.display = 'block';
    document.getElementById('leadSuccess').style.display = 'none';
    document.getElementById('leadError').style.display = 'none';
    document.getElementById('leadForm').reset();
    document.getElementById('leadEmail').classList.remove('lead-err');
    document.getElementById('leadPhone').classList.remove('lead-err');
    field.value = productName || '';
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = window.innerWidth - document.documentElement.clientWidth + 'px';
    ov.classList.add('open');
    setTimeout(function(){
      var firstInput = document.getElementById('leadName');
      if(firstInput) firstInput.focus();
      var modal = document.getElementById('lead-modal');
      if(modal) modal.scrollTop = 0;
    }, 50);
  }
  function closeLead(){
    ov.classList.remove('open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }
  window.openLead = openLead;
  window.closeLead = closeLead;

  document.getElementById('lead-x').onclick = closeLead;
  ov.addEventListener('click', function(e){ if(e.target===ov) closeLead(); });
  document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeLead(); });

  document.getElementById('leadForm').addEventListener('submit', function(e){
    e.preventDefault();
    var form = e.target;
    var btn = document.getElementById('leadSubmitBtn');
    var errEl = document.getElementById('leadError');
    var emailEl = document.getElementById('leadEmail');
    var phoneEl = document.getElementById('leadPhone');
    errEl.style.display = 'none';
    emailEl.classList.remove('lead-err');
    phoneEl.classList.remove('lead-err');

    if(!emailEl.value.trim() && !phoneEl.value.trim()){
      errEl.textContent = '⚠️ Please provide either an email or a phone number.';
      errEl.style.display = 'block';
      emailEl.classList.add('lead-err');
      phoneEl.classList.add('lead-err');
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Sending...';
    fetch(FORMSPREE_URL, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    }).then(function(res){
      if(res.ok){
        form.style.display = 'none';
        document.getElementById('leadSuccess').style.display = 'block';
      } else {
        throw new Error('submit failed');
      }
    }).catch(function(){
      errEl.textContent = '⚠️ Something went wrong. Please try again or email us directly at support@lufalight.com';
      errEl.style.display = 'block';
    }).finally(function(){
      btn.disabled = false;
      btn.textContent = 'Submit →';
    });
  });
})();
