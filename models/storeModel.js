const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    store_name: { type: String, required: true },
    logo: { type: String }, // URL to the logo image
    documents: [{ type: String }], // URLs to uploaded PDF/JPEG documents
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    sub_category: {
      type: Schema.Types.ObjectId,
      ref: "Subcategory",
      required: true,
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String, required: true },
      postal_code: { type: String, required: true },
    },
    website_link: { type: String },
    social_media_link: { type: String },
    business_hours: { type: String },
    location: {
      type: { type: String, enum: ["Point"], required: true },
      coordinates: { type: [Number], required: true }, // [longitude, latitude]
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("storeSchema", blogSchema);
