const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  category_code: { type: String, maxLength: 50 },
  category_name: { type: String, require: true },
  category_name_ar: { type: String, require: true },
  category_name_fr: { type: String, require: true },
  description: { type: String },
  operational_group: { type: String, enum: ["CAPEX", "OPEX"] },
  image: { type: String },
  logo: {
    filePath: String,
    fileType: String,
    fileName: String,
  },
});

const Category = mongoose.model("Categories", categorySchema);
module.exports = Category;
