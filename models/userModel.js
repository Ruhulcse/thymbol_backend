const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      required: false,
    },
    displayName:{
      type: String
    },
    image:{
      type: String
    },
    businessName: {
      type: String,
      required: false
    },
    userName: {
      type: String,
      required: false,
      trim: true,
    },
    email: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    phoneNumber: {
      type: String,
      required: false,
      trim: true,
    },
    password: {
      type: String,
      required: false,
      minlength: 5
    },
    token: {
      type: String,
      required: false
    },
    dateOfBirth: {
      type: Date,
      required: false,
    },
    address: {
      type: String,
      required: false
    },
    postalCode: {
      type: String,
      required: false,
      trim: true,
    },
    nid: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
      trim: true,
    },
    passport: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
      trim: true,
    },
    userType: {
      type: String,
      required: false,
      enum: [
        "supperadmin",
        "admin",
        "consumer",
        "merchant"
      ],
      default: "merchant",
    },
    userStatus: {
      type: String,
      required: false,
      enum: [
        "Pending",
        "Active",
        "Deactivated",
        "Suspended",
        "Rejected",
        "Blocked",
      ],
      default: "Active",
    },
  },
  { timestamps: true }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);
module.exports = User;
