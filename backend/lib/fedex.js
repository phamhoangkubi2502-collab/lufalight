// FedEx Web Services (REST) API client. Sandbox base URL shown below; switch to
// https://apis.fedex.com for production. Register at developer.fedex.com for
// FEDEX_API_KEY / FEDEX_API_SECRET (OAuth client credentials) before this goes live.
const BASE_URL = process.env.FEDEX_API_BASE_URL || 'https://apis-sandbox.fedex.com';

function isConfigured() {
  return Boolean(process.env.FEDEX_API_KEY && process.env.FEDEX_API_SECRET);
}

let cachedToken = null;
let tokenExpiresAt = 0;

async function getAccessToken() {
  if (cachedToken && Date.now() < tokenExpiresAt) return cachedToken;

  const res = await fetch(`${BASE_URL}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.FEDEX_API_KEY,
      client_secret: process.env.FEDEX_API_SECRET,
    }),
  });
  if (!res.ok) throw new Error(`FedEx OAuth failed: ${res.status}`);
  const data = await res.json();
  cachedToken = data.access_token;
  tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000;
  return cachedToken;
}

// Returns a rate quote in cents (CAD) or null if FedEx isn't configured / the call fails.
async function getRate({ weightKg, dimsCm, destCountry, destPostalCode }) {
  if (!isConfigured()) return null;

  try {
    const token = await getAccessToken();
    const res = await fetch(`${BASE_URL}/rate/v1/rates/quotes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        accountNumber: { value: process.env.FEDEX_ACCOUNT_NUMBER || '' },
        requestedShipment: {
          shipper: { address: { postalCode: process.env.WAREHOUSE_POSTAL_CODE || '', countryCode: 'CA' } },
          recipient: { address: { postalCode: destPostalCode || '', countryCode: destCountry } },
          pickupType: 'DROPOFF_AT_FEDEX_LOCATION',
          rateRequestType: ['ACCOUNT'],
          requestedPackageLineItems: [
            {
              weight: { units: 'KG', value: weightKg },
              dimensions: { length: dimsCm[0], width: dimsCm[1], height: dimsCm[2], units: 'CM' },
            },
          ],
        },
      }),
    });

    if (!res.ok) {
      console.error('[fedex.getRate] non-OK response', res.status, await res.text());
      return null;
    }
    const data = await res.json();
    const amount = data.output?.rateReplyDetails?.[0]?.ratedShipmentDetails?.[0]?.totalNetCharge?.amount;
    return amount ? Math.round(Number(amount) * 100) : null;
  } catch (err) {
    console.error('[fedex.getRate] request failed', err.message);
    return null;
  }
}

// Creates a shipment + label after payment. Returns { trackingNumber, labelUrl } or null.
async function createShipment({ order, weightKg, dimsCm }) {
  if (!isConfigured()) return null;

  try {
    const token = await getAccessToken();
    const res = await fetch(`${BASE_URL}/ship/v1/shipments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        accountNumber: { value: process.env.FEDEX_ACCOUNT_NUMBER || '' },
        requestedShipment: {
          shipper: { address: { postalCode: process.env.WAREHOUSE_POSTAL_CODE || '', countryCode: 'CA' } },
          recipients: [{ address: order.shipping_address }],
          pickupType: 'DROPOFF_AT_FEDEX_LOCATION',
          serviceType: 'FEDEX_GROUND',
          packagingType: 'YOUR_PACKAGING',
          requestedPackageLineItems: [
            {
              weight: { units: 'KG', value: weightKg },
              dimensions: { length: dimsCm[0], width: dimsCm[1], height: dimsCm[2], units: 'CM' },
            },
          ],
          labelSpecification: { labelFormatType: 'COMMON2D', imageType: 'PDF' },
        },
      }),
    });

    if (!res.ok) {
      console.error('[fedex.createShipment] non-OK response', res.status, await res.text());
      return null;
    }
    const data = await res.json();
    const piece = data.output?.transactionShipments?.[0]?.pieceResponses?.[0];
    return {
      trackingNumber: piece?.trackingNumber || null,
      labelUrl: piece?.packageDocuments?.[0]?.url || null,
    };
  } catch (err) {
    console.error('[fedex.createShipment] request failed', err.message);
    return null;
  }
}

module.exports = { isConfigured, getRate, createShipment };
