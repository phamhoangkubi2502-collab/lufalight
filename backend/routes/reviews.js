const express = require('express');
const rateLimit = require('express-rate-limit');
const { supabase } = require('../lib/supabase');

const router = express.Router();

// Stricter limit specifically on submission — spam/fake reviews are cheap to attempt
// and the moderation queue (GET /admin/reviews/pending) is the second line of defense.
const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many reviews submitted — please try again later.' },
});

// GET /api/reviews/:sku — public, only returns moderated (approved) reviews.
router.get('/:sku', async (req, res) => {
  const { data, error } = await supabase
    .from('reviews')
    .select('id, customer_name, rating, title, body, created_at')
    .eq('sku', req.params.sku)
    .eq('approved', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[GET /api/reviews/:sku]', error.message);
    return res.status(500).json({ error: 'Failed to load reviews' });
  }
  res.json({ reviews: data });
});

// POST /api/reviews  body: { sku, customer_name, rating, title?, body }
// Public submission — always lands as unapproved (approved:false) until an admin
// reviews it via /admin/reviews/pending. This is the spam/abuse safeguard: nothing a
// customer submits goes live without a human checking it first.
router.post('/', submitLimiter, async (req, res) => {
  const { sku, customer_name, rating, title, body } = req.body || {};

  if (!sku || typeof sku !== 'string') return res.status(400).json({ error: 'sku is required' });
  if (!customer_name || String(customer_name).trim().length === 0) {
    return res.status(400).json({ error: 'customer_name is required' });
  }
  if (!body || String(body).trim().length < 5) {
    return res.status(400).json({ error: 'A review body of at least 5 characters is required' });
  }
  const ratingNum = Number(rating);
  if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    return res.status(400).json({ error: 'rating must be an integer from 1 to 5' });
  }

  // Hard length caps so a malicious/buggy client can't write unbounded text into the DB.
  const safe = (s, max) => (s == null ? null : String(s).slice(0, max));

  const { error } = await supabase.from('reviews').insert({
    sku,
    customer_name: safe(customer_name, 60),
    rating: ratingNum,
    title: safe(title, 80),
    body: safe(body, 1000),
    approved: false,
  });

  if (error) {
    console.error('[POST /api/reviews]', error.message);
    return res.status(500).json({ error: 'Could not submit review' });
  }
  res.status(201).json({ ok: true, message: 'Review submitted for moderation' });
});

module.exports = router;
