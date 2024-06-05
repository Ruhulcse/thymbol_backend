const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  createStripeSession,
  webhook,
  youcanPay,
} = require("../controllers/payment");

router.route("/create-stripe-session-subscription").post(createStripeSession);
router.route("/webhook").post(webhook);
router.route("/youcanpay").post(youcanPay);

module.exports = router;
