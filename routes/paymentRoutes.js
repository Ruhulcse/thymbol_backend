const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { createStripeSession, webhook } = require("../controllers/payment");

router.route("/create-stripe-session-subscription").post(createStripeSession);
router.route("/webhook").post(webhook);

module.exports = router;
