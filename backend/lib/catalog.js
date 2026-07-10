// Shipping-relevant physical data per SKU, sourced from the product catalog (product.html
// DETAILS.specs). A few large panels don't list a weight in the catalog yet — those are
// marked estimate:true below and should be replaced with real measurements before launch.
const PACKAGE_DATA = {
  EM04:      { weightKg: 0.3,  dimsCm: [35, 20, 8],     estimate: true },
  G15P:      { weightKg: 0.38, dimsCm: [41, 27, 8] },
  G15:       { weightKg: 0.22, dimsCm: [41, 25, 8] },
  P40B:      { weightKg: 0.95, dimsCm: [30, 20, 8] },
  MINI60PRO: { weightKg: 0.55, dimsCm: [20, 14, 8] },
  E300:      { weightKg: 3.3,  dimsCm: [50, 35, 28] },
  C01:       { weightKg: 1.5,  dimsCm: [31, 24, 16] },
  G240:      { weightKg: 1.2,  dimsCm: [70, 28, 10] },
  BK300:     { weightKg: 3.8,  dimsCm: [40, 26, 10] },
  MAX1800:   { weightKg: 20,   dimsCm: [95, 46, 10],    estimate: true },
  MAX4800:   { weightKg: 35,   dimsCm: [193, 98, 10],   estimate: true },
  ESPRO3000: { weightKg: 18.5, dimsCm: [134, 37, 8] },
  PE01:      { weightKg: 18,   dimsCm: [194, 84, 14] },
  MRS45:     { weightKg: 9,    dimsCm: [40, 40, 110],   estimate: true },
};

function packageForItems(items) {
  // Combine all items into a single estimated package for rate-quote purposes
  // (most orders are 1-2 items; this is an approximation, not a bin-packing solver).
  let weightKg = 0;
  let maxDims = [0, 0, 0];
  for (const { sku, qty } of items) {
    const data = PACKAGE_DATA[sku];
    const quantity = Number(qty) || 1;
    if (!data) continue;
    weightKg += data.weightKg * quantity;
    maxDims = maxDims.map((d, i) => Math.max(d, data.dimsCm[i]));
  }
  return { weightKg: Math.max(weightKg, 0.1), dimsCm: maxDims.some((d) => d > 0) ? maxDims : [30, 20, 10] };
}

module.exports = { PACKAGE_DATA, packageForItems };
