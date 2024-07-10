const mongoose = require("mongoose");

const voucherSchema = new mongoose.Schema(
  {
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    store: { type: mongoose.Schema.Types.ObjectId, ref: "stores" },
    discount: { type: Number, required: false },
    endDate: { type: Date, required: true },
    voucherCode: { type: String, required: true, unique: true },
    storeName: { type: String, required: true },
    redeemLimit: { type: Number, required: true },
    redeemUsed: { type: Number, required: false, default: 0 },
    condition: { type: String, required: false },
    imageUrl: { type: String, required: false },
    offer: {
      type: String,
      required: false,
      enum: ["Buy One Get One Free", "Buy One Get One Half Off", "custom"],
    },
  },
  { timestamps: true }
);

const Store = mongoose.model("voucher", voucherSchema);
module.exports = Store;
