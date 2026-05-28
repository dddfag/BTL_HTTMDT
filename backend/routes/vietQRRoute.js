const express = require("express");
const {
  generateVietQRPayment,
  verifyVietQRPayment,
} = require("../controllers/vietQRPayment");

const router = express.Router();

// Generate VietQR payment info
router.route("/generate").post(generateVietQRPayment);

// Verify VietQR payment
router.route("/verify").post(verifyVietQRPayment);

module.exports = router;
