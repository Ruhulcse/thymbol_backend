const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { getQRdata, scanQRCode } = require("../controllers/qrcode");

router.route("/qrcodedata").post(protect, getQRdata);
router.route("/scan_qrcode").post(protect, scanQRCode);

module.exports = router;
