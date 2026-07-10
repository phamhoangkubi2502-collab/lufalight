const dhl = require('./dhl');
const fedex = require('./fedex');
const { packageForItems } = require('./catalog');

// Flat-rate fallback (cents, CAD) used until DHL_API_KEY / FEDEX_API_KEY are configured.
// Free standard shipping matches the site's existing "Free Shipping — Canada & USA" promise;
// express is a flat surcharge until real carrier rates replace these numbers.
const FALLBACK_RATES = {
  standard: { amountCents: 0, label: 'Standard Shipping (7-14 business days)' },
  express: { amountCents: 3500, label: 'Express Shipping (2-4 business days)' },
};

// Returns [{ id, label, amountCents, carrier }] — one entry per tier (standard/express).
// Tries DHL then FedEx for a live quote; falls back to FALLBACK_RATES if neither is configured
// or both calls fail, so checkout never breaks for lack of carrier credentials.
async function getShippingOptions({ items, destCountry, destPostalCode }) {
  const { weightKg, dimsCm } = packageForItems(items);
  const params = { weightKg, dimsCm, destCountry, destPostalCode };

  const [dhlRate, fedexRate] = await Promise.all([dhl.getRate(params), fedex.getRate(params)]);
  const liveRate = [dhlRate, fedexRate].filter((r) => r != null).sort((a, b) => a - b)[0];

  if (liveRate != null) {
    return [
      { id: 'standard', label: 'Standard Shipping (DHL/FedEx Ground)', amountCents: liveRate, carrier: dhlRate != null ? 'DHL' : 'FedEx' },
      { id: 'express', label: 'Express Shipping (DHL/FedEx Express)', amountCents: Math.round(liveRate * 1.8), carrier: dhlRate != null ? 'DHL' : 'FedEx' },
    ];
  }

  return [
    { id: 'standard', label: FALLBACK_RATES.standard.label, amountCents: FALLBACK_RATES.standard.amountCents, carrier: null },
    { id: 'express', label: FALLBACK_RATES.express.label, amountCents: FALLBACK_RATES.express.amountCents, carrier: null },
  ];
}

module.exports = { getShippingOptions, FALLBACK_RATES };
