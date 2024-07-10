const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    store_name: { type: String, required: true },
    logo: {
      filePath: String,
      fileType: String,
      fileName: String,
    }, // URL to the logo image
    documents: [
      {
        filePath: String,
        fileType: String,
        fileName: String,
      },
    ], // URLs to uploaded PDF/JPEG documents
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    sub_category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
      required: false,
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String, required: true },
      postal_code: { type: String, required: true },
    },
    website_link: { type: String },
    social_media_link: { type: String },
    business_hours: [
      {
        monday: { type: String },
        tuesday: { type: String },
        wednesday: { type: String },
        thursday: { type: String },
        friday: { type: String },
        saturday: { type: String },
        sunday: { type: String },
      },
    ],
    location: {
      type: { type: String, default: "Point" },
      coordinates: [Number], // [longitude, latitude]
    },
  },
  { timestamps: true }
);
storeSchema.index({ location: "2dsphere" });
const Store = mongoose.model("stores", storeSchema);
module.exports = Store;
