const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');
const mongoose = require('mongoose');
const axios = require('axios');

//Login for Users
const Login = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	const user = await User.findOne({
		$or: [{ email: email }, { phoneNumber: email }],
	});
	if (user && (await user.matchPassword(password))) {
		res.json({
			message: 'login success',
			data: {
				_id: user._id,
				email: user.email,
				phoneNumber: user.phoneNumber,
				token: generateToken(user._id),
				userType: user.userType,
				SubscriptionType: user.SubscriptionType,
			},
			error: false,
		});
	} else {
		res.status(202).send(new Error('Invalid email or password!'));
	}
});

////Registration  for Users
const Registration = asyncHandler(async (req, res) => {
	const { email } = req.body;

	const userExists = await User.findOne({ email });

	console.log('user exist', userExists);

	if (userExists) {
		const error = new Error('user already exist');
		res.status(400).json({ message: error.message });
	}

	const user = new User({
		...req.body,
		createdBy: req.body?.createdBy ?? null,
		password: req.body.password ? req.body.password : '123456',
	});

	try {
		const createUser = await user.save();
		res.json({
			message: req.body?.createdBy
				? 'Admin Successfully Created!'
				: 'Registration Successfully Complited!',
			data: createUser,
		});
	} catch (error) {
		res.status(501).send('Error Found! Can not complete registration!');
		//console.log(error);
	}
});

const getAllUsers = asyncHandler(async (req, res) => {
	try {
		const allUsers = await User.find({ userType: { $ne: 'agent' } });
		res.json({
			message: 'successfully registration',
			data: allUsers,
		});
	} catch (error) {
		console.log(error);
	}
});

// Get single user by ID
const getUserById = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id).select('-password');
	if (user) {
		res.json(user);
	} else {
		res.status(404).json({ message: 'User not found' });
	}
});

// Update single user
const updateUser = asyncHandler(async (req, res) => {
	//const user = await User.findById(req.params.id);
	if (mongoose.Types.ObjectId.isValid(req.params.id)) {
		const updatedUser = await User.findOneAndUpdate(
			{ _id: req.params.id },
			{
				...req.body,
			},
			{
				returnDocument: 'after', // Return the updated document
				projection: { password: 0 }, // Exclude 'fieldToExclude'
			}
		);
		if (updatedUser) {
			res.json({
				message: 'User updated successfully!',
				data: updatedUser,
				error: false,
			});
		} else {
			res.status(404).send({
				message: 'Data With given ID not found',
				error: true,
				statusCode: 404,
			});
		}
	} else {
		res.status(400).send({
			message: 'Given ID not valid!',
			error: true,
			statusCode: 400,
		});
	}
});

// Delete single user
const deleteUser = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id);
	if (user) {
		await User.deleteOne({ _id: req.params.id });
		res.json({ message: 'User deleted successfully' });
	} else {
		res.status(404).json({ message: 'Data with given ID not found!' });
	}
});

//get agent type user

const getAllAgentUsers = asyncHandler(async (req, res) => {
	try {
		const allUsers = await User.find({ userType: 'agent' });
		res.json({
			message: 'successfully get all agent user',
			data: allUsers,
		});
	} catch (error) {
		console.log(error);
	}
});

const getTypeWiseUsers = asyncHandler(async (req, res) => {
	const adminUsers = await User.find({
		userType: req.body.user_type,
		createdBy: req.body.user_id,
	}).sort({
		createdAt: -1,
	});
	if (adminUsers.length) {
		res.status(200).send({
			data: adminUsers,
			message: 'Admin users succesully retrive!',
			statusCode: 200,
		});
	} else {
		res.status(404).send({
			data: [],
			message: 'Data with given ID not found!',
			statusCode: 404,
		});
	}
});

const updatePayment = asyncHandler(async (req, res) => {
	const { email, priceId, type } = req.body;
	// console.log();

	// Check if the required fields are present
	// if (!email || !price_id || !type) {
	//   return res
	//     .status(400)
	//     .json({ message: "Email, price_id, and type are required." });
	// }

	// Find the user by email
	const user = await User.findOne({ email });

	if (!user) {
		return res.status(404).json({ message: 'User not found.' });
	}

	// Update the user with the new price_id and type
	user.subId = priceId;
	user.SubscriptionType = type;
	user.subscriptionActive = true;

	// Save the updated user
	await user.save();

	// Respond with a success message
	res.status(200).json({ message: 'User updated successfully.', email });
});

const getIpAddress = asyncHandler(async (req, res) => {
	try {
		const response = await axios.get('http://ipinfo.io?token=4f7fa06a36b49f');
		// res.json(response.data);
		res.status(200).json({ data: response.data });
	} catch (error) {
		console.log(error);
		res.status(500).send('Error fetching location data');
	}
});
module.exports = {
	Login,
	Registration,
	getAllUsers,
	getUserById,
	updateUser,
	deleteUser,
	getAllAgentUsers,
	getTypeWiseUsers,
	updatePayment,
	getIpAddress,
};
