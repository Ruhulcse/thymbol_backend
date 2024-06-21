const asyncHandler = require("express-async-handler");
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
const clippedVoucher = async (req, res)=>{
  const clippableVouchers = req.body.clipped_vouchers;
  const dbData = await consumerVsVoucher.find({consume_by: req.body.consume_by});
  if(dbData.length){
    let temp = [...dbData[0].clipped_vouchers, ...clippableVouchers];
    try{
      const updateConsumerDetails = await consumerVsVoucher.findOneAndUpdate(
        { consume_by: req.body.consume_by },
        {
          ...req.body,
          clipped_vouchers: temp
        },
        {
          returnDocument: 'after',     // Return the updated document
        }
      );
      res.json({
        message: "Successfully added to clipped list!",
        data: updateConsumerDetails,
        error: false
      });
    }catch(error){
      res.status(501).send('Error Found! Can not added to clipped list!');
    }
  }else{
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
      res.status(501).send('Error Found! Can not added to clipped list!');
      //console.log(error);
    }
  }
}
const clippedDetails = async(req, res)=>{
  const consumerDetails = await consumerVsVoucher.find({consume_by: req.params.id})
  if(consumerDetails.length && consumerDetails[0].clipped_vouchers.length){

    try{
      const voucherDetails = await Voucher.find({
        _id: { $in: consumerDetails[0].clipped_vouchers }
      })
      res.json({
        message: "Clipped Details Succesfully retrive!",
        data: voucherDetails,
      });
    }catch(error){
      res.status(404).send({
        data: [],
        message: "Clipped Details not found!"
      })
    }
  }else{
    res.status(404).send({
      data: [],
      message: "Clipped Details not found!"
    })
  }
}
module.exports = {
  saveVoucherData,
  getAllVoucher,
  clippedVoucher,
  clippedDetails
};
