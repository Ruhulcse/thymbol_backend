const asyncHandler = require("express-async-handler");
const QRcode = require("../models/qrCodeModel");

const getQRdata = async (req, res) => {
  const creator = req.user._id;
  const { voucher, voucherCode } = req.body;
  //   console.log("createor ", creator);
  try {
    //first search QR code for this particular user
    const QRdata = await QRcode.find({ creator: creator, voucher: voucher });
    // console.log("qr data ", QRdata);
    if (QRdata.length == 0) {
      //   console.log("jere ");
      const newCode = new QRcode({
        creator,
        voucher,
        voucherCode,
      });
      const savedQRCode = await newCode.save();
      res.status(201).send({
        data: savedQRCode,
        message: "Successfully get QR data",
        statusCode: 201,
        error: false,
      });
    } else {
      res.status(409).send({
        // 409 Conflict might be more appropriate here
        message: "You have already generated a QR code for this voucher.",
        statusCode: 409,
        error: true,
      });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  getQRdata,
};
