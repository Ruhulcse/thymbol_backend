const express = require("express");
const {
  saveVoucherData,
  getAllVoucher,
  clippedVoucher,
  clippedDetails,
  getvoucherByStore,
  getSingleVoucher,
  deleteVoucher,
  updateVoucherDetails
} = require("../controllers/voucher");
const router = express.Router();
const { protect } = require("../middleware/auth");

router.route("/voucher").post(saveVoucherData).get(protect, getAllVoucher);
router.route("/voucher/:id").get(getSingleVoucher);
router.route("/voucherbystore/:id").get(getvoucherByStore);
router.route("/voucher/clipped-for-later").post(protect, clippedVoucher);
router.route("/voucher/clipped-details/:id").get(protect, clippedDetails);
router.route("/voucher/:id").delete(protect, deleteVoucher)
router.route("/voucher/:id").patch(protect, updateVoucherDetails);

module.exports = router;
