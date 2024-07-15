const mongoose = require("mongoose");
const pushNotification = require("../models/pushNotificationModel");
const Store = require("../models/storeModel");
const ConsumerVsVoucher = require("../models/consumerVsVoucherModel");
const { ObjectId } = require("mongodb");
const asyncHandler = require("express-async-handler");
const { getIO, userSockets } = require("../socket");

const createPushNotification = async (req, res) => {
  const newNotification = new pushNotification({ ...req.body });
  const owner_id = req.user._id;
  //   console.log("owner id ", owner_id);
  const receivers = await getNotificationReceivers(owner_id);
  //   console.log("notification receivers ", receivers);
  try {
    const createNotification = await newNotification.save();

    //sent notification to all subscriber
    const io = getIO();
    receivers.forEach((receiverId) => {
      const receiverSocket = userSockets.get(receiverId);
      if (receiverSocket) {
        io.to(receiverSocket.id).emit("notification", {
          title: req.body.title,
          details: req.body.description,
        });
      } else {
        console.log(`User with ID ${receiverId} is not connected`);
      }
    });
    res.status(201).send({
      message: "Notification Successfully Created!",
      data: createNotification,
    });
  } catch (error) {
    console.log("error is ", error);
    res.status(501).send("Error Found! Can not create notification!");
  }
};

async function getNotificationReceivers(owner_id) {
  let notificationReceivers = [];
  try {
    // Find all stores owned by the specific owner
    const stores = await Store.find({ owner: owner_id });
    const storeIds = stores.map((store) => store._id);

    // Use aggregation to find all unique consumer IDs
    const aggregationResults = await ConsumerVsVoucher.aggregate([
      {
        $match: {
          favourite_stores: { $in: storeIds },
        },
      },
      {
        $group: {
          _id: null,
          consumerIds: { $addToSet: "$consume_by" }, // Collecting unique consumer IDs
        },
      },
    ]);

    // Check if we have results and map ObjectIds to strings
    if (aggregationResults.length > 0) {
      notificationReceivers = aggregationResults[0].consumerIds.map((id) =>
        id.toString()
      );
    }
  } catch (err) {
    console.error("Error processing data: ", err);
  }

  return notificationReceivers;
}

const getPushNotification = async (req, res) => {
  const notification = await pushNotification.findById(req.params.id);
  if (notification) {
    res.status(200).send({
      data: notification,
      message: "Notification Successfully Retrive!",
    });
  } else {
    res.status(404).json({ message: "Notification not found" });
  }
};

const getAllNotification = async (req, res) => {
  const notications = await pushNotification.find();
  if (notications.length) {
    res.status(200).send({
      data: notications,
      message: "Notifications Successfully Retrive!",
    });
  } else {
    res.status(404).json({ message: "Notifications not found" });
  }
};

const deletePushNotification = async (req, res) => {
  const ids = req.body.ids;

  if (ids.length) {
    try {
      // Convert string IDs to ObjectId
      const objectIds = ids.map((id) => new mongoose.Types.ObjectId(id));
      const result = await pushNotification.deleteMany({
        _id: { $in: objectIds },
      });

      res.status(200).send({
        message: "Notification Successfully deleted!",
        data: ids,
      });
    } catch (err) {
      res.status(501).send({
        message: "Error Found! Can not delete notifications!",
        data: [],
      });
    }
  } else {
    res.status(400).send({
      message: "Notification Ids is Empty!",
    });
  }
};

const updatePushNotification = asyncHandler(async (req, res) => {
  //const user = await User.findById(req.params.id);
  if (mongoose.Types.ObjectId.isValid(req.params.id)) {
    const updateNotification = await pushNotification.findOneAndUpdate(
      { _id: req.params.id },
      {
        ...req.body,
      },
      {
        returnDocument: "after", // Return the updated document
      }
    );
    if (updateNotification) {
      res.json({
        message: "Notification updated successfully!",
        data: updateNotification,
        error: false,
      });
    } else {
      res.status(404).send({
        message: "Data With given ID not found",
        error: true,
        statusCode: 404,
      });
    }
  } else {
    res.status(400).send({
      message: "Given ID not valid!",
      error: true,
      statusCode: 400,
    });
  }
});

module.exports = {
  createPushNotification,
  getPushNotification,
  deletePushNotification,
  getAllNotification,
  updatePushNotification,
};
