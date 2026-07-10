# LUFALIGHT — Plan to Build a "Kala Red Light" Style Shop

Reference: https://kalaredlight.com/en-intl/collections/shop-all

## 1. What Kala does that we need to replicate

- **Shop All / collection page**: grid of products, left sidebar filters (by category, coverage, bundles, sale status)
- **Product card**: image, name, short benefit line, price (with sale price shown if discounted), badges ("Trending", "Selling out fast", "Bundle"), Add to Cart
- **Categories**: Skin Health, Recovery & Performance, Hair Health, Wellness/Sauna, Pet, Bundles, Gift Cards
- **Trust badges**: medical-grade, FDA cleared, 30-day guarantee, free shipping
- **Cart + checkout**: real payments, shipping, accounts, order tracking

## 2. What's been added now (Phase 0 — done)

- New [shop.html](shop.html) page:
  - Sidebar filters by product line (SKIN, MIND, RECOVER, CLEAR, SLEEP, RELIEF, SHIELD, GROW) and by coverage (Full Body / Targeted / Wearable)
  - Sort by price/name
  - 16 placeholder SKUs (2 per line) + 2 bundles, with placeholder prices in VND
  - Slide-out cart (localStorage-based, no backend)
  - Checkout = builds an order summary and opens your Zalo link (`ZALO_LINK` constant — **needs your real Zalo/TikTok link**)
  - "Shop" link added to main nav in [index.html](index.html)

⚠️ All product names, descriptions, icons (emoji placeholders), and prices are **placeholders** — replace with real data from `LUFALIGHT_Catalog_v13.pdf` and real product photos.

## 3. Phase 1 — Make it production-ready (still static, 1-2 weeks)

1. **Real product data**
   - Extract actual SKUs, specs, wavelengths, prices from the catalog PDF
   - Replace emoji icons with real product photos (`/images/products/...`)
   - Add 2nd image per product (in-use shot, like Kala does)
2. **Product detail pages** (optional but recommended)
   - Each product gets its own page with full description, specs, wavelength chart, usage instructions, FAQs
   - Link from shop grid card → detail page → "Add to Cart"
3. **Visual polish**
   - Hero banner image for shop page (lifestyle photo)
   - Trust badge strip (FDA notice, warranty, shipping policy — adapted to VN market)
   - "Best Seller" / "New" / "Sale" badges driven by real sales data
4. **Content pages**
   - Reviews/testimonials per product
   - Blog / education section (you already planned this in README future ideas)
   - FAQ page

## 4. Phase 2 — Real cart & checkout

Static HTML + localStorage cart is fine for **browsing**, but real checkout (payment, inventory, shipping, order history) needs a platform. Options, ranked for your context (TikTok/Zalo-first, Vietnam, then North America):

| Option | Pros | Cons | Best if... |
|---|---|---|---|
| **Shopify** (Recommended) | Fast setup, built-in payments (incl. VNPay/MoMo via apps), inventory, themes close to Kala's look, easy NA expansion later | Monthly fee (~$29+/mo), less custom control | You want to launch fast & scale to NA in Phase 3 |
| **Haravan / Sapo** (VN-focused) | Local VN payment/shipping integrations (COD, MoMo, ZaloPay, GHN/GHTK), Vietnamese support | Less polished for NA expansion | Phase 1 is 100% VN, TikTok/Zalo-driven |
| **Custom (Next.js + Stripe/VNPay + headless CMS)** | Full control, matches current site exactly, can keep current design | Needs dev resources, ongoing maintenance | You have/are building dev capacity |

**Recommendation**: Given Phase 1 is VN + TikTok/Zalo DM-driven (per your existing copy), keep the current static site + cart-to-Zalo flow for now (already built). When ready to accept online payments, migrate to **Haravan/Sapo** (VN) or **Shopify** (if NA expansion is near-term) — both let you import the product catalog you build in Phase 1 directly.

## 5. Phase 3 — North America expansion (per your existing roadmap)

- Migrate to Shopify (or add a second storefront) with USD pricing
- Add FDA/Health Canada compliance badges (you already have this for GROW line)
- English-first copy (site is already bilingual-ready)
- Influencer/TikTok Shop US integration

## 6. Immediate next steps (your input needed)

1. Provide real product names/prices/specs from the catalog (or let me try extracting the PDF again with a working tool)
2. Provide real Zalo/TikTok contact link → update `ZALO_LINK` in [shop.html](shop.html)
3. Provide product photos → replace emoji placeholders
4. Decide: keep cart-to-Zalo for now, or start Shopify/Haravan migration immediately?
