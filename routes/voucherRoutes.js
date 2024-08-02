const express = require("express");
const {
  saveVoucherData,
  getAllVoucher,
  clippedVoucher,
  clippedDetails,
  getvoucherByStore,
  getSingleVoucher,
  addToFavourite,
  getFavouriteStores,
  deleteVoucher,
  updateVoucherDetails,
  getCouponsAnalytics
} = require("../controllers/voucher");
const router = express.Router();
const { protect } = require("../middleware/auth");

router.route("/voucher/get/analytics").get(protect, getCouponsAnalytics);
router.route("/voucher").post(protect, saveVoucherData).get(protect, getAllVoucher);
router.route("/add_favourite").post(protect, addToFavourite);
router.route("/get_favourite").get(protect, getFavouriteStores);
router.route("/voucher/:id").get(getSingleVoucher);
router.route("/voucherbystore/:id").get(getvoucherByStore);
router.route("/voucher/clipped-for-later").post(protect, clippedVoucher);
router.route("/voucher/clipped-details/:id").get(protect, clippedDetails);
router.route("/voucher/:id").delete(protect, deleteVoucher);
router.route("/voucher/:id").patch(protect, updateVoucherDetails);

module.exports = router;
