const mongoose = require("mongoose");

const pushNotificationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: false },
    is_seen: {type: Number, default: 0},
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
},{ timestamps: true })

const pushNotification = mongoose.model("pushNotifications", pushNotificationSchema);
module.exports = pushNotification;