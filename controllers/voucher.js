const asyncHandler = require("express-async-handler");
const { uploadToS3 } = require("../utils/functions");
const Voucher = require("../models/voucherModel");

const saveVoucherData = async (req, res) => {
  const image = req.files.image;
  const { voucherData } = req.body;
  console.log("voucher data ", voucherData);

  try {
    // Parse the voucherData if it's a string
    const parsedVoucherData =
      typeof voucherData === "string" ? JSON.parse(voucherData) : voucherData;
    // Save store data into MongoDB
    const voucherInfo = new Voucher(parsedVoucherData);
    const createdVoucher = await voucherInfo.save(); // Remember to await the save operation
    res.status(201).send(createdVoucher);
  } catch (error) {
    console.error("error is ", error);
    res.status(500).send(error);
  }
};
const getAllVoucher = async (req, res) => {
  try {
    const vouchers = await Voucher.find();
    res.status(200).send(vouchers);
  } catch (error) {
    console.error("Error fetching vouchers:", error);
    res.status(500).send(error);
  }
};
module.exports = {
  saveVoucherData,
  getAllVoucher,
};
