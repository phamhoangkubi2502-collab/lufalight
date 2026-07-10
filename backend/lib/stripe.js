const Stripe = require('stripe');

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('[lufalight-backend] STRIPE_SECRET_KEY not set — checkout/refund calls will fail until .env is configured.');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
});

module.exports = { stripe };
