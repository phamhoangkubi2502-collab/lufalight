/**
 * Syncs the shared nav / mobile-drawer / footer markup from partials/
 * into every page listed below. Run this after editing any file in
 * partials/ to propagate the change site-wide:
 *
 *   node scripts/sync-partials.js
 *
 * Pages excluded from a given sync are listed explicitly with the
 * reason — they intentionally keep a different version of that block.
 */
const fs = require('fs');
const path = require('path');

const repo = path.join(__dirname, '..');
const partialsDir = path.join(repo, 'partials');

const allPages = [
  'index.html', 'product.html', 'shop-all.html', 'ambassador.html', 'order-confirmed.html',
  'wholesale.html', 'special-orders.html', 'warranty.html', 'terms.html', 'shipping-returns.html', 'quiz.html',
  'product-guide.html', 'privacy-policy.html', 'our-story.html', 'compare.html', 'blog.html',
  'blog-wavelengths.html', 'blog-sleep.html', 'blog-safety.html', 'blog-recovery.html',
  'blog-pbm-science.html', 'blog-bk300-safety.html', 'ambassador-terms.html', 'ambassador-dashboard.html',
];

// order-confirmed.html keeps its own minimal header/footer by design (no mega-menu, no full footer grid).
const NAV_EXCLUDE = new Set(['order-confirmed.html']);
const MOB_DRAWER_EXCLUDE = new Set(['order-confirmed.html']);
// index.html keeps an expanded homepage-only footer (8 product deep-links + #science/#faq anchors
// that only resolve on that same page). Ambassador-family + compare.html keep their own shorter
// footer variant. order-confirmed.html has no footer at all to sync into.
const FOOTER_EXCLUDE = new Set([
  'index.html', 'order-confirmed.html',
  'ambassador.html', 'ambassador-terms.html', 'ambassador-dashboard.html',
  'compare.html',
]);

function readPartial(name) {
  return fs.readFileSync(path.join(partialsDir, name), 'utf8').replace(/\n/g, '\r\n').trim();
}

const navPartial = readPartial('nav.html');
const mobDrawerPartial = readPartial('mob-drawer.html');
const footerPartial = readPartial('footer.html');

const navRe = /<nav>[\s\S]*?<\/nav>/;
const footerRe = /<footer>[\s\S]*?<\/footer>/;

// The mob-drawer block is just nested <div>s with no unique closing tag, so a
// generic "match up to the Nth closing </div>" regex is ambiguous — the drawer's
// own inner markup (e.g. the logo's nested divs) can contain the same "N closing
// divs in a row" pattern well before the block's true end, causing a truncated
// match and a duplicated/orphaned tail (this happened once already). Find the
// true end by counting div depth from the opening tag instead.
function replaceMobDrawer(html, partial) {
  const startTag = '<div id="mob-overlay"';
  const start = html.indexOf(startTag);
  if (start === -1) return { html, changed: false };
  const tagRe = /<div\b|<\/div>/g;
  tagRe.lastIndex = start;
  let depth = 0;
  let end = -1;
  let m;
  while ((m = tagRe.exec(html))) {
    if (m[0] === '<\/div>') {
      depth--;
      if (depth === 0) { end = m.index + m[0].length; break; }
    } else {
      depth++;
    }
  }
  if (end === -1) return { html, changed: false };
  return { html: html.slice(0, start) + partial + html.slice(end), changed: true };
}

let totalChanges = 0;
for (const page of allPages) {
  const p = path.join(repo, page);
  let html = fs.readFileSync(p, 'utf8');
  let changed = [];

  if (!NAV_EXCLUDE.has(page) && navRe.test(html)) {
    html = html.replace(navRe, navPartial);
    changed.push('nav');
  }
  if (!MOB_DRAWER_EXCLUDE.has(page)) {
    const res = replaceMobDrawer(html, mobDrawerPartial);
    if (res.changed) { html = res.html; changed.push('mob-drawer'); }
  }
  if (!FOOTER_EXCLUDE.has(page) && footerRe.test(html)) {
    html = html.replace(footerRe, footerPartial);
    changed.push('footer');
  }

  if (changed.length) {
    fs.writeFileSync(p, html, 'utf8');
    totalChanges++;
  }
  console.log(page.padEnd(28), '->', changed.length ? changed.join(', ') : '(no sync targets matched)');
}
console.log('\nDone. Files updated:', totalChanges, '/', allPages.length);
