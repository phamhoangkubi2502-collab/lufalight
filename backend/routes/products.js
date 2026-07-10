const express = require('express');
const { supabase } = require('../lib/supabase');

const router = express.Router();

// GET /api/products — active products + current stock, for the storefront to display
// availability (e.g. "only 3 left" / "out of stock") without exposing internal fields.
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('products')
    .select('sku, name, price_cents, warranty_years, inventory(stock_qty)')
    .eq('active', true);

  if (error) {
    console.error('[GET /api/products]', error.message);
    return res.status(500).json({ error: 'Failed to load products' });
  }

  const products = data.map((p) => ({
    sku: p.sku,
    name: p.name,
    price_cents: p.price_cents,
    warranty_years: p.warranty_years,
    in_stock: (p.inventory?.stock_qty ?? 0) > 0,
    stock_qty: p.inventory?.stock_qty ?? 0,
  }));

  res.json({ products });
});

module.exports = router;
