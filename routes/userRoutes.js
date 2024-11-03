const express = require('express');
const router = express.Router();
const { protect, isShipper, isCarrier } = require('../middleware/auth');
const validationMiddleware = require('../middleware/validationMiddleware');
const userDto = require('../Dto/UserCreate.dto');
const {
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
} = require('../controllers/auth');
const { setProfilePic } = require('../controllers/upload');

//router.route("/register", validationMiddleware(userDto)).post(Registration);
//router.post('/register', Registration);
router.route('/register').post(Registration);
router.route('/login').post(Login);
router.route('/payment_success').post(updatePayment);
router.route('/upload').post(setProfilePic);
router.route('/users').get(protect, getAllUsers);
router.route('/specefic-type-of-users').post(getTypeWiseUsers);
router
	.route('/user/:id')
	.get(protect, getUserById)
	.put(protect, updateUser)
	.delete(protect, deleteUser);
router.route('/agent-users').get(protect, getAllAgentUsers);

router.route('/get-ip').get(getIpAddress);

module.exports = router;
