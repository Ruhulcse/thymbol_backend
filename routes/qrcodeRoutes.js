const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { getQRdata } = require("../controllers/qrcode");

router.route("/qrcodedata").post(protect, getQRdata);

module.exports = router;
