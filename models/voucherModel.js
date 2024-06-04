const mongoose = require("mongoose");

const voucherSchema = new mongoose.Schema(
  {
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    store: { type: mongoose.Schema.Types.ObjectId, ref: "stores" },
    discount: { type: Number, required: true },
    endDate: { type: Date, required: true },
    voucherCode: { type: String, required: true, unique: true },
    storeName: { type: String, required: true },
    redeemLimit: { type: Number, required: true },
    condition: { type: String, required: false },
    imageUrl: { type: String, required: false },
  },
  { timestamps: true }
);

const Store = mongoose.model("voucher", voucherSchema);
module.exports = Store;
