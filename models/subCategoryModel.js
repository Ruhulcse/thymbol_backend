const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema({
  sub_category_name: { type: String, require: true },
  sub_category_code: { type: String, require: false },
  description: { type: String },
  parent_category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
});

const Subcategory = mongoose.model("Subcategories", subCategorySchema);
module.exports = Subcategory;
