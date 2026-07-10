const express = require('express');
const { supabase } = require('../lib/supabase');
const { stripe } = require('../lib/stripe');
const { getShippingOptions } = require('../lib/shipping-rates');

const router = express.Router();

// POST /api/checkout  body: { items: [{ sku, qty }], affiliate_code?, destCountry? }
// Validates stock, creates a Stripe Checkout Session, returns the redirect URL.
// The frontend never talks to Stripe directly — this keeps the secret key server-side only.
router.post('/', async (req, res) => {
  const { items, affiliate_code, destCountry } = req.body || {};

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'items[] is required' });
  }

  const skus = items.map((i) => i.sku);
  const { data: products, error } = await supabase
    .from('products')
    .select('sku, name, price_cents, active, inventory(stock_qty)')
    .in('sku', skus);

  if (error) {
    console.error('[POST /api/checkout] product lookup failed', error.message);
    return res.status(500).json({ error: 'Could not verify products' });
  }

  const bySku = new Map(products.map((p) => [p.sku, p]));
  const line_items = [];

  for (const { sku, qty } of items) {
    const product = bySku.get(sku);
    const quantity = Number(qty) || 1;

    if (!product || !product.active) {
      return res.status(400).json({ error: `Unknown or inactive SKU: ${sku}` });
    }
    const stock = product.inventory?.stock_qty ?? 0;
    if (stock < quantity) {
      return res.status(409).json({ error: `${product.name} is out of stock (have ${stock}, requested ${quantity})` });
    }

    line_items.push({
      quantity,
      price_data: {
        currency: 'cad',
        unit_amount: product.price_cents,
        product_data: { name: product.name },
      },
    });
  }

  try {
    const shippingOptions = await getShippingOptions({ items, destCountry: destCountry || 'CA' });

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      success_url: `${process.env.CHECKOUT_SUCCESS_URL}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: process.env.CHECKOUT_CANCEL_URL,
      shipping_address_collection: { allowed_countries: ['CA', 'US'] },
      shipping_options: shippingOptions.map((opt) => ({
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: opt.amountCents, currency: 'cad' },
          display_name: opt.label,
          delivery_estimate: {
            minimum: { unit: 'business_day', value: opt.id === 'express' ? 2 : 7 },
            maximum: { unit: 'business_day', value: opt.id === 'express' ? 4 : 14 },
          },
        },
      })),
      metadata: {
        items: JSON.stringify(items),
        affiliate_code: affiliate_code || '',
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('[POST /api/checkout] Stripe session creation failed', err.message);
    res.status(500).json({ error: 'Could not start checkout' });
  }
});

module.exports = router;
