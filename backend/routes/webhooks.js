const express = require('express');
const { supabase } = require('../lib/supabase');
const { stripe } = require('../lib/stripe');
const dhl = require('../lib/dhl');
const fedex = require('../lib/fedex');
const { packageForItems } = require('../lib/catalog');

const router = express.Router();

// POST /api/webhooks/stripe
// NOTE: this route is mounted with express.raw() in index.js (not express.json())
// because Stripe signature verification needs the exact raw request body.
router.post('/stripe', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('[webhook] signature verification failed', err.message);
    return res.status(400).send(`Webhook signature verification failed`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    try {
      await fulfillOrder(session);
    } catch (err) {
      // Returning 500 tells Stripe to retry the webhook later — don't swallow this.
      console.error('[webhook] order fulfillment failed', err.message);
      return res.status(500).send('Fulfillment error');
    }
  }

  res.json({ received: true });
});

async function fulfillOrder(session) {
  const items = JSON.parse(session.metadata?.items || '[]');
  const affiliateCode = session.metadata?.affiliate_code || null;

  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .insert({
      stripe_session_id: session.id,
      customer_email: session.customer_details?.email,
      shipping_address: session.shipping_details?.address || null,
      status: 'paid',
      affiliate_code: affiliateCode,
    })
    .select()
    .single();

  if (orderErr) throw new Error(`order insert failed: ${orderErr.message}`);

  for (const { sku, qty } of items) {
    const quantity = Number(qty) || 1;

    const { error: itemErr } = await supabase.from('order_items').insert({
      order_id: order.id,
      sku,
      qty: quantity,
      unit_price_cents: 0, // backfilled from products table if needed; Stripe line items hold authoritative price
    });
    if (itemErr) console.error(`[webhook] order_item insert failed for ${sku}:`, itemErr.message);

    // Best-effort stock decrement, floored at 0. A proper implementation would use a
    // Postgres function with row locking to avoid a race under concurrent orders —
    // acceptable for current (low) order volume, flagged here for a future hardening pass.
    const { data: inv } = await supabase.from('inventory').select('stock_qty').eq('sku', sku).single();
    if (inv) {
      const newQty = Math.max(0, inv.stock_qty - quantity);
      await supabase.from('inventory').update({ stock_qty: newQty, updated_at: new Date().toISOString() }).eq('sku', sku);
    }
  }

  await createShipmentForOrder(order, items);

  // TODO (Phase 3): if affiliateCode is set, look up the affiliate and insert a `commissions` row.
  // TODO (Phase 4): trigger Klaviyo order-confirmation email via its API.
}

// Creates a carrier shipment + label once an order is paid. Tries DHL first, then FedEx.
// If neither carrier is configured yet (no API keys), this is a no-op — the order stays
// 'paid' with no tracking number until shipping credentials are added (see backend/.env.example).
async function createShipmentForOrder(order, items) {
  if (!dhl.isConfigured() && !fedex.isConfigured()) {
    console.log(`[webhook] order ${order.id}: no carrier configured yet, skipping label creation`);
    return;
  }

  const { weightKg, dimsCm } = packageForItems(items);
  const carrier = dhl.isConfigured() ? dhl : fedex;
  const carrierName = dhl.isConfigured() ? 'DHL' : 'FedEx';

  const shipment = await carrier.createShipment({ order, weightKg, dimsCm });
  if (!shipment) {
    console.error(`[webhook] order ${order.id}: shipment creation failed via ${carrierName}`);
    return;
  }

  await supabase
    .from('orders')
    .update({ carrier: carrierName, tracking_number: shipment.trackingNumber, status: 'shipped' })
    .eq('id', order.id);
}

module.exports = router;
