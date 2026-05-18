const express = require("express");
const {
  getRevenueDashboard,
  getRevenueTrends,
  getRevenueByProduct,
  getSalesReport,
  getPaymentMethodBreakdown,
} = require("../controllers/revenue");
const { checkIfUserIsAnAdminMiddleware } = require("../middleware/adminAuthorisation");

const router = express.Router();

// All routes require admin verification
router.use(checkIfUserIsAnAdminMiddleware);

// Get revenue dashboard metrics
router.route("/dashboard").get(getRevenueDashboard);

// Get revenue trends over time
router.route("/trends").get(getRevenueTrends);

// Get revenue by product
router.route("/products").get(getRevenueByProduct);

// Get detailed sales report
router.route("/report").get(getSalesReport);

// Get payment method breakdown
router.route("/payment-methods").get(getPaymentMethodBreakdown);

module.exports = router;
