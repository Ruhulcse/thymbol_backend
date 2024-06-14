const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");
const mongoose = require("mongoose");

//Login for Users
const Login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      message: "login success",
      data: {
        _id: user._id,
        email: user.email,
        token: generateToken(user._id),
        userType: user.userType,
      },
      error: false
    });
  } else {
    res.status(202).send(new Error("Invalid email or password!"));
  }
});

////Registration  for Users
const Registration = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const userExists = await User.findOne({ email });

  console.log("user exist", userExists);

  if (userExists) {
    const error = new Error("user already exist");
    res.status(400).json({ message: error.message });
  }

  const user = new User({
    ...req.body,
    createdBy: req.body?.createdBy ?? null,
    password: req.body.password ? req.body.password : "123456",
  });

  try {
    const createUser = await user.save();
    res.json({
      message: req.body?.createdBy ? "Admin Successfully Created!" : "Registration Successfully Complited!",
      data: createUser,
    });
  } catch (error) {
    res.status(501).send('Error Found! Can not complete registration!');
    //console.log(error);
  }
});

const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const allUsers = await User.find({ userType: { $ne: "agent" } });
    res.json({
      message: "successfully registration",
      data: allUsers,
    });
  } catch (error) {
    console.log(error);
  }
});

// Get single user by ID
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// Update single user
const updateUser = asyncHandler(async (req, res) => {
  //const user = await User.findById(req.params.id);
  if (mongoose.Types.ObjectId.isValid(req.params.id)) {
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.params.id },
      {
        ...req.body
      },
      {
        returnDocument: 'after',     // Return the updated document
        projection: { password: 0 } // Exclude 'fieldToExclude'
      }
    )
    if (updatedUser) {
      res.json({
        message: "User updated successfully!",
        data: updatedUser,
        error: false
      });
    } else {
      res.status(404).send({ message: "Data With given ID not found", error: true, statusCode: 404 });
    }
  } else {
    res.status(400).send({
      message: "Given ID not valid!",
      error: true,
      statusCode: 400
    })
  }
});


// Delete single user
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await User.deleteOne({ _id: req.params.id })
    res.json({ message: "User deleted successfully" });
  } else {
    res.status(404).json({ message: "Data with given ID not found!" });
  }
});

//get agent type user

const getAllAgentUsers = asyncHandler(async (req, res) => {
  try {
    const allUsers = await User.find({ userType: "agent" });
    res.json({
      message: "successfully get all agent user",
      data: allUsers,
    });
  } catch (error) {
    console.log(error);
  }
});

const getTypeWiseUsers = asyncHandler(async (req, res) => {
  const adminUsers = await User.find({
    userType: req.body.user_type,
    createdBy: req.body.user_id
  })
  if (adminUsers.length) {
    res.status(200).send({
      data: adminUsers,
      message: "Admin users succesully retrive!",
      statusCode: 200
    })
  } else {
    res.status(404).send({
      data: [],
      message: "Data with given ID not found!",
      statusCode: 404
    })
  }
})
module.exports = {
  Login,
  Registration,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAllAgentUsers,
  getTypeWiseUsers
};
