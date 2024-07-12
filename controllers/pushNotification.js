const mongoose = require("mongoose");
const pushNotification = require("../models/pushNotificationModel");
const { ObjectId } = require('mongodb');

const createPushNotification = async (req, res) => {
    const newNotification = new pushNotification({ ...req.body });

    try {
        const createNotification = await newNotification.save();
        res.status(201).send({
            message: "Notification Successfully Created!",
            data: createNotification
        })
    } catch (error) {
        res.status(501).send("Error Found! Can not create notification!");
    }
}

const getPushNotification = async (req, res) => {
    const notification = await pushNotification.findById(req.params.id);
    if (notification) {
        res.status(200).send({ data: notification, message: "Notification Successfully Retrive!" });
    } else {
        res.status(404).json({ message: "Notification not found" });
    }
}

const getAllNotification = async (req, res) => {
    const notications = await pushNotification.find();
    if (notications.length) {
        res.status(200).send({ data: notications, message: "Notifications Successfully Retrive!" });
    } else {
        res.status(404).json({ message: "Notifications not found" });
    }
}

const deletePushNotification = async (req, res) => {
    const ids = req.body.ids;

    if (ids.length) {
        try {
            // Convert string IDs to ObjectId
            const objectIds = ids.map(id => new mongoose.Types.ObjectId(id));
            const result = await pushNotification.deleteMany({
                _id: { $in: objectIds }
            });

            res.status(200).send({
                message: "Notification Successfully deleted!",
                data: ids
            })
        } catch (err) {
            res.status(501).send({
                message: "Error Found! Can not delete notifications!",
                data: []
            })
        }
    } else {
        res.status(400).send({
            message: "Notification Ids is Empty!"
        })
    }
}

module.exports = {
    createPushNotification,
    getPushNotification,
    deletePushNotification,
    getAllNotification

}