const aws = require("aws-sdk");
require("dotenv").config();

// Initialize the S3
const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const uploadToS3 = async (file, filePath) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: filePath,
    Body: file.data,
    ACL: "public-read",
  };

  try {
    const data = await s3.upload(params).promise();
    console.log("Upload successful:", data);
    return data;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};

module.exports = { uploadToS3 };
