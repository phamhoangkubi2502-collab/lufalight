const express = require('express');
const { supabase } = require('../lib/supabase');
const { stripe } = require('../lib/stripe');
const { requireAdmin } = require('../lib/adminAuth');

const router = express.Router();

// Every /admin/* route requires a real Supabase Auth session (Authorization: Bearer <jwt>)
// belonging to an email in ADMIN_EMAILS — see lib/adminAuth.js.
router.use(requireAdmin);

// GET /admin/inventory — current stock per SKU, flags anything at/under threshold
router.get('/inventory', async (req, res) => {
  const { data, error } = await supabase
    .from('inventory')
    .select('sku, stock_qty, low_stock_threshold, products(name)')
    .order('sku');

  if (error) return res.status(500).json({ error: error.message });

  const rows = data.map((r) => ({
    sku: r.sku,
    name: r.products?.name,
    stock_qty: r.stock_qty,
    low_stock_threshold: r.low_stock_threshold,
    low_stock: r.stock_qty <= r.low_stock_threshold,
  }));
  res.json({ inventory: rows });
});

// PATCH /admin/inventory/:sku  body: { stock_qty }
router.patch('/inventory/:sku', async (req, res) => {
  const { stock_qty } = req.body || {};
  if (typeof stock_qty !== 'number' || stock_qty < 0) {
    return res.status(400).json({ error: 'stock_qty must be a non-negative number' });
  }
  const { error } = await supabase
    .from('inventory')
    .update({ stock_qty, updated_at: new Date().toISOString() })
    .eq('sku', req.params.sku);

  if (error) return res.status(500).json({ error: error.message });
  console.log(`[admin] ${req.adminUser.email} set ${req.params.sku} stock_qty=${stock_qty}`);
  res.json({ ok: true });
});

// POST /admin/refund  body: { order_id }
// Looks up the order's Stripe session, refunds the underlying payment, marks the order refunded.
router.post('/refund', async (req, res) => {
  const { order_id } = req.body || {};
  if (!order_id) return res.status(400).json({ error: 'order_id is required' });

  const { data: order, error } = await supabase.from('orders').select('*').eq('id', order_id).single();
  if (error || !order) return res.status(404).json({ error: 'Order not found' });

  try {
    const session = await stripe.checkout.sessions.retrieve(order.stripe_session_id);
    if (!session.payment_intent) return res.status(400).json({ error: 'No payment found for this order' });

    await stripe.refunds.create({ payment_intent: session.payment_intent });
    await supabase.from('orders').update({ status: 'refunded' }).eq('id', order_id);

    console.log(`[admin] ${req.adminUser.email} refunded order ${order_id}`);
    res.json({ ok: true });
  } catch (err) {
    console.error('[POST /admin/refund]', err.message);
    res.status(500).json({ error: 'Refund failed' });
  }
});

// GET /admin/reviews/pending — reviews awaiting moderation, oldest first
router.get('/reviews/pending', async (req, res) => {
  const { data, error } = await supabase
    .from('reviews')
    .select('id, sku, customer_name, rating, title, body, created_at')
    .eq('approved', false)
    .order('created_at', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  res.json({ reviews: data });
});

// POST /admin/reviews/:id/approve — publish a review
router.post('/reviews/:id/approve', async (req, res) => {
  const { error } = await supabase.from('reviews').update({ approved: true }).eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  console.log(`[admin] ${req.adminUser.email} approved review ${req.params.id}`);
  res.json({ ok: true });
});

// DELETE /admin/reviews/:id — reject/remove a review (spam, abuse, etc.)
router.delete('/reviews/:id', async (req, res) => {
  const { error } = await supabase.from('reviews').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  console.log(`[admin] ${req.adminUser.email} deleted review ${req.params.id}`);
  res.json({ ok: true });
});

module.exports = router;
