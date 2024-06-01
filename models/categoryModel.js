const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
    {
        category_code: { type: String, maxLength: 50 },
        category_name: { type: String, require: true },
        description: { type: String },
        operational_group: { type: String, enum: ["CAPEX", "OPEX"] }
    }
)

const Category = mongoose.model("Categories", categorySchema);
module.exports = Category;