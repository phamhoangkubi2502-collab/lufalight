/* ══════════════════════════════════════════════════════════════
   LUFALIGHT — SHARED SITE BEHAVIOR
   Back-to-top button, mobile drawer close, mega-menu hover/click
   positioning, scroll-reveal (.rv) observer, and active nav-link
   highlighting. Loaded on every page via <script src="shared.js">.
   ══════════════════════════════════════════════════════════════ */

/* ── BACK TO TOP ── */
(function(){
  var btn=document.getElementById('back-to-top');
  if(!btn)return;
  window.addEventListener('scroll',function(){btn.classList.toggle('show',window.scrollY>600)},{passive:true});
})();

/* ── MOBILE DRAWER CLOSE ── */
(function(){
  function closeMob(){var ov=document.getElementById('mob-overlay');if(ov)ov.classList.remove('open');}
  window.closeMob=closeMob;
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeMob();});
  var links=document.querySelectorAll('#mob-drawer a');
  for(var i=0;i<links.length;i++){links[i].addEventListener('click',closeMob);}
})();

/* ── MEGA MENU (hover + click positioning) ── */
document.addEventListener('click',function(e){
  if(!e.target.closest('.nav-item')){document.querySelectorAll('.nav-item.open').forEach(function(o){o.classList.remove('open')})}
});
document.addEventListener('keydown',function(e){
  if(e.key==='Escape')document.querySelectorAll('.nav-item.open').forEach(function(o){o.classList.remove('open')})
});
function positionMegaMenu(it){
  var m=it.querySelector('.mega-menu');if(!m)return;
  m.style.left='0px';
  var r=m.getBoundingClientRect();
  var shift=0;
  var overflowRight=r.right-(window.innerWidth-16);
  if(overflowRight>0)shift=-overflowRight;
  var newLeft=r.left+shift;
  if(newLeft<16)shift+=(16-newLeft);
  m.style.left=shift+'px';
}
document.querySelectorAll('.nav-item').forEach(function(it){
  var ct;
  it.addEventListener('mouseenter',function(){clearTimeout(ct);it.classList.add('open');positionMegaMenu(it)});
  it.addEventListener('mouseleave',function(){ct=setTimeout(function(){it.classList.remove('open')},300)});
});
document.addEventListener('click',function(e){
  var car=e.target.closest('.mega-caret');
  if(car){var it=car.closest('.nav-item');if(it&&it.classList.contains('open'))positionMegaMenu(it)}
});
window.addEventListener('resize',function(){document.querySelectorAll('.nav-item.open').forEach(positionMegaMenu)});

/* ── SCROLL-REVEAL (.rv) ── */
(function(){
  var els=document.querySelectorAll('.rv');
  if(!els.length)return;
  var obs=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)e.target.classList.add('on')})},{threshold:.12});
  els.forEach(function(el){obs.observe(el)});
})();

/* ── ACTIVE NAV LINK ──
   Highlights the nav-links/mob-drawer link matching the current
   page, so nav markup no longer needs a hardcoded "on" class. */
(function(){
  var here=location.pathname.split('/').pop()||'index.html';
  document.querySelectorAll('.nav-links > a[href], .mob-sub a[href], .mob-link[href]').forEach(function(a){
    var href=a.getAttribute('href').split('#')[0].split('?')[0];
    if(href===here || (here==='' && href==='index.html')){
      a.classList.add('on');
    }
  });
})();
