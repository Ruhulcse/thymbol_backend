const express = require("express");
const router = express.Router();
const { createReview, getReviewsByStoreId } = require("../controllers/review");

router.route("/create_review").post(createReview);
router.route("/get_reviewbystoreid/:storeId").get(getReviewsByStoreId);

module.exports = router;
