const mongoose = require("mongoose");

const consumerVsVoucherSchema = new mongoose.Schema(
  {
    consume_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    clipped_vouchers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "voucher",
      required: false,
    },
    redeem_vouchers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "voucher",
      required: false,
    },
    voucher_limit: {
      type: Number,
      default: 4,
    },
  },
  { timestamps: true }
);
