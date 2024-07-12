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

const scanQRCode = async (req, res) => {
  const scanner = req.user._id;
  const { voucher, voucherCode, creator } = req.body;
  try {
    //first search QR code for this particular user
    const QRdata = await QRcode.findOne({
      creator: creator,
      voucher: voucher,
      is_scanned: false,
    });
    if (!QRdata) {
      res.status(404).send({
        // 409 Conflict might be more appropriate here
        message: "Invalid QR Code",
        statusCode: 404,
        error: true,
      });
    } else {
      console.log("QR code  Exist ", QRdata);
      QRdata.is_scanned = true;
      QRdata.scanner = scanner; // Optionally record who scanned it
      console.log("data ", QRdata);
      await QRdata.save();
      res.status(201).send({
        data: QRdata,
        message: "Successfully scanned QR code",
        statusCode: 201,
        error: false,
      });
    }
  } catch (error) {
    console.log("errror ", error);
    res.status(500).send(error);
  }
};

module.exports = {
  getQRdata,
  scanQRCode,
};
