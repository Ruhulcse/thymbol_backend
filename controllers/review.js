const asyncHandler = require("express-async-handler");
const Review = require("../models/reviewModel");
const mongoose = require("mongoose");
const path = require("path");
const { uploadToS3 } = require("../utils/functions");

// Create a new review
exports.createReview = asyncHandler(async (req, res) => {
  const video = req.files.video;
  const { creator, store } = req.body;
  const videoUrl = await uploadVideo(store, video);

  //   console.log(creator, store, videoUrl);

  const newReview = new Review({
    creator,
    store,
    videoUrl,
  });

  console.log("newReview", newReview);
  const savedReview = await newReview.save();
  console.log("save ", savedReview);
  res.status(201).json(savedReview);
});

const uploadVideo = async (store_id, file) => {
  const filetypes = /mp4|avi|mov|wmv|mkv/;
  const extname = filetypes.test(path.extname(file.name).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  const fileExtension = file.mimetype.split("/")[1];
  const directory = "store/reviews";
  const timestamp = Date.now();
  const videoFilePath = `${directory}/${store_id}/video_${timestamp}.${fileExtension}`;
  if (mimetype && extname) {
    const result = await uploadToS3(file, videoFilePath);
    if (result) {
      return result.Location;
    } else {
      throw new Error("Can not upload review video!");
    }
  } else {
    throw new Error("Invalid file type!");
  }
};
// Get reviews by store ID
exports.getReviewsByStoreId = asyncHandler(async (req, res) => {
  const { storeId } = req.params;
  try {
    const reviews = await Review.find({ store: storeId });
    if (!reviews.length) {
      return res
        .status(404)
        .json({ message: "No reviews found for this store" });
    }
    res.status(200).json(reviews);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// Get a review by ID
exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).populate(
      "creator store"
    );
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.status(200).json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all reviews
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate("creator store");
    res.status(200).json(reviews);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a review by ID
exports.updateReviewById = async (req, res) => {
  try {
    const { creator, store, videoUrl } = req.body;
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      { creator, store, videoUrl },
      { new: true, runValidators: true }
    ).populate("creator store");

    if (!updatedReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json(updatedReview);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a review by ID
exports.deleteReviewById = async (req, res) => {
  try {
    const deletedReview = await Review.findByIdAndDelete(req.params.id);
    if (!deletedReview) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
