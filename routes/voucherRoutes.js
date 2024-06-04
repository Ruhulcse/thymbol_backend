const express = require("express");
const { saveVoucherData, getAllVoucher } = require("../controllers/voucher");
const router = express.Router();

router.route("/voucher").post(saveVoucherData).get(getAllVoucher);

module.exports = router;
