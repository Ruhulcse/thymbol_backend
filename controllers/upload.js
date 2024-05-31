const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const User = require("../models/userModel");
const { uploadToS3 } = require("../utils/functions");

exports.setProfilePic = async (req, res) => {
  // console.log(process.env.S3_ACCESS_KEY);
  // const uploadSingle = upload("profile-picture-upload-youtube").single(
  //   "croppedImage"
  // );

  // uploadSingle(req, res, async (err) => {
  //   if (err) console.error("Upload error:", err);
  //   return res.status(400).json({ success: false, message: err.message });

  //   await User.create({ photoUrl: req.file.location });

  //   res.status(200).json({ data: req.file.location });
  // });
  try {
    console.log("request file is ", req.files.profilePic);
    const file = req.files.profilePic;
    const fileExtension = file.mimetype.split("/")[1];
    const directory = "profilePics";
    const timestamp = Date.now();
    const filePath = `${directory}/pic_${timestamp}.${fileExtension}`;
    if (file) {
      const result = await uploadToS3(file, filePath);
      return res.status(201).json({
        message: "file upload done",
        body: result,
      });
    }
  } catch (e) {
    console.log("controller error ", e);
    return res.status(500).json({
      message: "something went wrong",
    });
  }
};
