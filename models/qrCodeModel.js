const mongoose = require("mongoose");

const qrCodeSchema = new mongoose.Schema(
  {
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    voucher: { type: mongoose.Schema.Types.ObjectId, ref: "voucher" },
    voucherCode: { type: String, required: true, unique: true },
    scanner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    is_active: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

const QRcode = mongoose.model("qrcode", qrCodeSchema);
module.exports = QRcode;
