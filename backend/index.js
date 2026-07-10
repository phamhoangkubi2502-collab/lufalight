require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const productsRouter = require('./routes/products');
const checkoutRouter = require('./routes/checkout');
const webhooksRouter = require('./routes/webhooks');
const adminRouter = require('./routes/admin');
const reviewsRouter = require('./routes/reviews');

const app = express();
// Needed so express-rate-limit reads the real client IP behind Render/Railway's proxy,
// instead of rate-limiting the proxy's IP for every visitor combined.
app.set('trust proxy', 1);

const allowedOrigins = (process.env.CORS_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
app.use(cors({ origin: allowedOrigins.length ? allowedOrigins : true }));

// Stripe webhook needs the raw body for signature verification, so it's mounted
// BEFORE express.json() and given its own raw parser. Not rate-limited — Stripe retries
// failed webhooks on its own schedule and is already authenticated via signature.
app.use('/api/webhooks', express.raw({ type: 'application/json' }), webhooksRouter);

app.use(express.json());

// Rate limiting — prevents checkout-spam / scraping / brute-force against admin routes.
// Generous limit for read-only product browsing, tighter for state-changing endpoints.
const publicLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300, standardHeaders: true, legacyHeaders: false });
const checkoutLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, standardHeaders: true, legacyHeaders: false, message: { error: 'Too many checkout attempts — please try again in a few minutes.' } });
const adminLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 60, standardHeaders: true, legacyHeaders: false, message: { error: 'Too many admin requests — please try again in a few minutes.' } });

app.use('/api/products', publicLimiter, productsRouter);
app.use('/api/checkout', checkoutLimiter, checkoutRouter);
app.use('/api/reviews', publicLimiter, reviewsRouter);
app.use('/admin', adminLimiter, adminRouter);

app.get('/health', (req, res) => res.json({ ok: true }));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`[lufalight-backend] listening on :${port}`));
