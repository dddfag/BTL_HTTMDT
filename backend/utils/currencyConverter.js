/**
 * DEPRECATED: This file is no longer used in the application.
 * 
 * As of the VND migration, all prices are stored and handled in VND natively.
 * There is no need to convert currencies anymore.
 * 
 * Migration Details:
 * - All product prices stored in database as VND
 * - Frontend displays prices in VND format using formatPriceVND()
 * - Payment systems (VietQR) receive VND amounts directly
 * - Orders stored with VND totals
 * 
 * This file can be safely deleted after confirming no other code references it.
 * Keep only if you need the exchange rate reference for documentation purposes.
 */

// Fixed exchange rate: 1 USD = 24,000 VNĐ (reference only - no longer used in app)
const USD_TO_VND_RATE = 24000;

// DEPRECATED - Do not use
const convertUsdToVnd = (usdAmount) => {
  console.warn("convertUsdToVnd() is deprecated. All prices should be in VND already.");
  return Math.round(usdAmount * USD_TO_VND_RATE);
};

// DEPRECATED - Do not use
const convertVndToUsd = (vndAmount) => {
  console.warn("convertVndToUsd() is deprecated. All prices should be in VND.");
  return (vndAmount / USD_TO_VND_RATE).toFixed(2);
};

module.exports = {
  convertUsdToVnd,
  convertVndToUsd,
  USD_TO_VND_RATE,
};
