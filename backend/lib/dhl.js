// DHL Express API client. Real endpoints (production): https://express.api.dhl.com/mydhlapi
// Sandbox: https://express.api.dhl.com/mydhlapi/test — register at developer.dhl.com to get
// DHL_API_KEY (and account number) before this goes live.
const BASE_URL = process.env.DHL_API_BASE_URL || 'https://express.api.dhl.com/mydhlapi/test';

function isConfigured() {
  return Boolean(process.env.DHL_API_KEY);
}

// Returns a rate quote in cents (CAD) or null if DHL isn't configured / the call fails.
async function getRate({ weightKg, dimsCm, destCountry }) {
  if (!isConfigured()) return null;

  try {
    const res = await fetch(`${BASE_URL}/rates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.DHL_API_KEY}`,
      },
      body: JSON.stringify({
        customerDetails: {
          shipperDetails: { postalCode: process.env.WAREHOUSE_POSTAL_CODE || '', countryCode: 'CA' },
          receiverDetails: { countryCode: destCountry },
        },
        accounts: [{ typeCode: 'shipper', number: process.env.DHL_ACCOUNT_NUMBER || '' }],
        packages: [{ weight: weightKg, dimensions: { length: dimsCm[0], width: dimsCm[1], height: dimsCm[2] } }],
        plannedShippingDateAndTime: new Date().toISOString(),
        unitOfMeasurement: 'metric',
      }),
    });

    if (!res.ok) {
      console.error('[dhl.getRate] non-OK response', res.status, await res.text());
      return null;
    }
    const data = await res.json();
    const product = data.products?.[0];
    if (!product) return null;
    return Math.round(Number(product.totalPrice?.[0]?.price || 0) * 100);
  } catch (err) {
    console.error('[dhl.getRate] request failed', err.message);
    return null;
  }
}

// Creates a shipment + label after payment. Returns { trackingNumber, labelUrl } or null.
async function createShipment({ order, weightKg, dimsCm }) {
  if (!isConfigured()) return null;

  try {
    const res = await fetch(`${BASE_URL}/shipments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.DHL_API_KEY}`,
      },
      body: JSON.stringify({
        plannedShippingDateAndTime: new Date().toISOString(),
        productCode: 'P',
        accounts: [{ typeCode: 'shipper', number: process.env.DHL_ACCOUNT_NUMBER || '' }],
        customerDetails: {
          shipperDetails: { postalCode: process.env.WAREHOUSE_POSTAL_CODE || '', countryCode: 'CA' },
          receiverDetails: order.shipping_address,
        },
        content: {
          packages: [{ weight: weightKg, dimensions: { length: dimsCm[0], width: dimsCm[1], height: dimsCm[2] } }],
          isCustomsDeclarable: order.shipping_address?.country !== 'CA',
          description: 'Lufalight red light therapy device',
        },
      }),
    });

    if (!res.ok) {
      console.error('[dhl.createShipment] non-OK response', res.status, await res.text());
      return null;
    }
    const data = await res.json();
    return {
      trackingNumber: data.shipmentTrackingNumber,
      labelUrl: data.documents?.[0]?.url || null,
    };
  } catch (err) {
    console.error('[dhl.createShipment] request failed', err.message);
    return null;
  }
}

module.exports = { isConfigured, getRate, createShipment };
