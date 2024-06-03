const users = require("./userRoutes");
const payments = require("./paymentRoutes");
const store = require("./storeRoutes");
const auth = require("./auth")
module.exports = [users, store, payments,auth];
