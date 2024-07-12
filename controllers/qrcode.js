const asyncHandler = require("express-async-handler");
const path = require("path");

const Voucher = require("../models/voucherModel");
const consumerVsVoucher = require("../models/consumerVsVoucherModel");

const getQRdata = async (req, res) => {
  console.log("requested ", req.user);
  try {
    res.status(201).send("data");
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  getQRdata,
};
