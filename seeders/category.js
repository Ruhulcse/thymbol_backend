const mongoose = require("mongoose");
const Category = require("../models/categoryModel");
const Subcategory = require("../models/subCategoryModel");
const connectDB = require("../config/db");
const dotenv = require("dotenv");
dotenv.config();
connectDB();

const categoriesData = [
  { category_name: "RESTAURANTS", description: "", operational_group: "OPEX" },
  { category_name: "SALONS", description: "", operational_group: "OPEX" },
  { category_name: "BARBERSHOPS", description: "", operational_group: "OPEX" },
  { category_name: "RETAIL STORE", description: "", operational_group: "OPEX" },
  { category_name: "FITNESS", description: "", operational_group: "OPEX" },
];

const subcategoriesData = [
  { sub_category_name: "Pizza", parent_category_name: "RESTAURANTS" },
  { sub_category_name: "Brunch", parent_category_name: "RESTAURANTS" },
  { sub_category_name: "Tacos", parent_category_name: "RESTAURANTS" },
  { sub_category_name: "Mediterranean", parent_category_name: "RESTAURANTS" },
  {
    sub_category_name: "Fish and seafood",
    parent_category_name: "RESTAURANTS",
  },
  {
    sub_category_name: "Breads and Bakery",
    parent_category_name: "RESTAURANTS",
  },
  { sub_category_name: "Coffee", parent_category_name: "RESTAURANTS" },
  { sub_category_name: "Desserts", parent_category_name: "RESTAURANTS" },
  { sub_category_name: "Fast Food", parent_category_name: "RESTAURANTS" },
  { sub_category_name: "Nails", parent_category_name: "SALONS" },
  { sub_category_name: "Hairstyles", parent_category_name: "SALONS" },
  { sub_category_name: "Spa", parent_category_name: "SALONS" },
  { sub_category_name: "Men's", parent_category_name: "BARBERSHOPS" },
  { sub_category_name: "Clothing", parent_category_name: "RETAIL STORE" },
  { sub_category_name: "Electronics", parent_category_name: "RETAIL STORE" },
  { sub_category_name: "Gym", parent_category_name: "FITNESS" },
  { sub_category_name: "Personal Trainer", parent_category_name: "FITNESS" },
  { sub_category_name: "Nutrition", parent_category_name: "FITNESS" },
];

const seedDatabase = async () => {
  console.log("seeding started...");
  try {
    await Category.deleteMany({});
    await Subcategory.deleteMany({});

    const categoryMap = {};
    for (let category of categoriesData) {
      const newCategory = new Category(category);
      const savedCategory = await newCategory.save();
      categoryMap[category.category_name] = savedCategory._id;
    }

    for (let subcategory of subcategoriesData) {
      const parentCategoryId = categoryMap[subcategory.parent_category_name];
      const newSubcategory = new Subcategory({
        ...subcategory,
        parent_category_id: parentCategoryId,
      });
      await newSubcategory.save();
    }

    console.log("Database seeded successfully");
    mongoose.connection.close();
  } catch (err) {
    console.error("Error seeding database:", err);
    mongoose.connection.close();
  }
};

seedDatabase();
