// Price formatter for Vietnamese Dong (VND)
// Database now stores prices directly in VND

// Format VND price with Vietnamese currency symbol
const formatPriceVND = (vndAmount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(vndAmount);
};

// Get just the formatted number (in case needed)
const getPriceVNDNumber = (vndAmount) => {
  return Math.round(vndAmount);
};

module.exports = {
  formatPriceVND,
  getPriceVNDNumber,
};
