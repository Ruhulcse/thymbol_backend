const express = require("express");
const router = express.Router();
const { protect, isShipper, isCarrier } = require("../middleware/auth");

const {
  createPushNotification,
  getPushNotification,
  deletePushNotification,
  getAllNotification,
  updatePushNotification,
  GetMedicalData,
} = require("../controllers/pushNotification");

router.route("/push-notificaton/create").post(protect, createPushNotification);
router.route("/push-notificaton/all").get(protect, getAllNotification);
router
  .route("/push-notificaton/delete")
  .delete(protect, deletePushNotification);
router
  .route("/push-notificaton/:id")
  .get(protect, getPushNotification)
  .patch(protect, updatePushNotification);

module.exports = router;
