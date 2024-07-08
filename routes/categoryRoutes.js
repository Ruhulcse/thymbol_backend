const express = require("express");
const router = express.Router();
const { protect, isShipper, isCarrier } = require("../middleware/auth");
const {
  saveCategoryData,
  viewCategory,
  editCategory,
  deleteCategory,
  getAllCategories,
} = require("../controllers/category");

router.route("/category/create").post(saveCategoryData);
router.route("/category/get-all-categories").get(protect, getAllCategories);
router
  .route("/category/:id")
  .get(protect, viewCategory)
  .patch(protect, editCategory)
  .delete(protect, deleteCategory);

module.exports = router;
