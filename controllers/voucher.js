const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const path = require("path");
const { uploadToS3 } = require("../utils/functions");
const Voucher = require("../models/voucherModel");
const consumerVsVoucher = require("../models/consumerVsVoucherModel");

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
    if (image) {
      const updatedLogoDetails = await updateVoucherLogo(
        createdVoucher._id,
        image
      );
    }
    res.status(201).send(createdVoucher);
  } catch (error) {
    console.error("error is ", error);
    res.status(500).send(error);
  }
};
const updateVoucherLogo = async (voucherId, file) => {
  const filetypes = /jpeg|jpg|png|pdf|docx/;
  const extname = filetypes.test(path.extname(file.name).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  const fileExtension = file.mimetype.split("/")[1];
  const directory = "voucher";
  const timestamp = Date.now();
  const logoFilePath = `${directory}/${voucherId}/logo_${timestamp}.${fileExtension}`;
  if (mimetype && extname) {
    const result = await uploadToS3(file, logoFilePath);
    if (result) {
      const logoDetails = {
        filePath: result.Location,
        fileType: file.mimetype,
        fileName: file.name,
      };
      const updatedVoucher = await Voucher.findByIdAndUpdate(
        voucherId,
        { logo: logoDetails },
        { new: true }
      );
      return updatedVoucher;
    } else {
      throw new Error("Can not update store logo!");
    }
  } else {
    throw new Error("Invalid file type!");
  }
};
const getAllVoucher = async (req, res) => {
  try {
    const creator = req.user._id;
    const vouchers = await Voucher.find({ creator: creator }).sort({
      createdAt: -1,
    });
    res.status(200).send(vouchers);
  } catch (error) {
    console.error("Error fetching vouchers:", error);
    res.status(500).send(error);
  }
};
const getSingleVoucher = async (req, res) => {
  try {
    const voucher_id = req.params.id;
    const vouchers = await Voucher.findById(voucher_id);
    res.status(200).send(vouchers);
  } catch (error) {
    console.error("Error fetching vouchers:", error);
    res.status(500).send(error);
  }
};
const clippedVoucher = async (req, res) => {
  const clippableVouchers = req.body.clipped_vouchers;
  const dbData = await consumerVsVoucher.find({
    consume_by: req.body.consume_by,
  });
  if (dbData.length) {
    let temp = [...dbData[0].clipped_vouchers, ...clippableVouchers];
    try {
      const updateConsumerDetails = await consumerVsVoucher.findOneAndUpdate(
        { consume_by: req.body.consume_by },
        {
          ...req.body,
          clipped_vouchers: temp,
        },
        {
          returnDocument: "after", // Return the updated document
        }
      );
      res.json({
        message: "Successfully added to clipped list!",
        data: updateConsumerDetails,
        error: false,
      });
    } catch (error) {
      res.status(501).send("Error Found! Can not added to clipped list!");
    }
  } else {
    const consumersCreate = new consumerVsVoucher({
      ...req.body,
    });

    try {
      const create = await consumersCreate.save();
      res.json({
        message: "Successfully added to clipped list!",
        data: create,
      });
    } catch (error) {
      res.status(501).send("Error Found! Can not added to clipped list!");
      //console.log(error);
    }
  }
};
const clippedDetails = async (req, res) => {
  const consumerDetails = await consumerVsVoucher.find({
    consume_by: req.params.id,
  });
  if (consumerDetails.length && consumerDetails[0].clipped_vouchers.length) {
    try {
      const voucherDetails = await Voucher.find({
        _id: { $in: consumerDetails[0].clipped_vouchers },
      });
      res.json({
        message: "Clipped Details Succesfully retrive!",
        data: voucherDetails,
      });
    } catch (error) {
      res.status(404).send({
        data: [],
        message: "Clipped Details not found!",
      });
    }
  } else {
    res.status(404).send({
      data: [],
      message: "Clipped Details not found!",
    });
  }
};
const getvoucherByStore = async (req, res) => {
  console.log("rested. ", req.params.id);
  const store_id = req.params.id;
  try {
    const voucherDetails = await Voucher.find({
      store: store_id,
    });
    res.json({
      message: "all voucher for this store",
      data: voucherDetails,
    });
  } catch (error) {
    res.status(404).send({
      data: [],
      message: "voucher data not found!",
    });
  }
};
const deleteVoucher = asyncHandler(async (req, res) => {
  const voucher = await Voucher.findById(req.params.id);
  if (voucher) {
    await voucher.deleteOne({ _id: new mongoose.Types.ObjectId(req.params.id) });
    res.status(200).send({
      message: "voucher deleted successfully!",
      error: false,
      statusCode: 200,
    });
  } else {
    res.status(404).send({
      message: "Data with given ID not found!",
      error: true,
      statusCode: 404,
    });
  }
});
const updateVoucherDetails = async (req, res) => {
  if (mongoose.Types.ObjectId.isValid(req.params.id)) {
    const updateVoucher = await Voucher.findOneAndUpdate(
      { _id: req.params.id },
      {
        ...req.body,
      },
      {
        returnDocument: "after", // Return the updated document
      }
    );
    if (updateVoucher) {
      res.json({
        message: "Vocher updated successfully!",
        data: updateVoucher,
        error: false,
      });
    } else {
      res
        .status(404)
        .send({
          message: "Data With given ID not found",
          error: true,
          statusCode: 404,
        });
    }
  } else {
    res.status(400).send({
      message: "Given ID not valid!",
      error: true,
      statusCode: 400,
    });
  }
}
module.exports = {
  saveVoucherData,
  getAllVoucher,
  clippedVoucher,
  clippedDetails,
  getvoucherByStore,
  getSingleVoucher,
  deleteVoucher,
  updateVoucherDetails
};
