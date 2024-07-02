const express = require("express");
const {
  saveVoucherData,
  getAllVoucher,
  clippedVoucher,
  clippedDetails,
  getvoucherByStore,
} = require("../controllers/voucher");
const router = express.Router();
const { protect } = require("../middleware/auth");

router.route("/voucher").post(saveVoucherData).get(protect, getAllVoucher);
router.route("/voucherbystore/:id").get(getvoucherByStore);
router.route("/voucher/clipped-for-later").post(protect, clippedVoucher);
router.route("/voucher/clipped-details/:id").get(protect, clippedDetails);

module.exports = router;
