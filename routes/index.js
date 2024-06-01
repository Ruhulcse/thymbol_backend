const users = require("./userRoutes");
const payments = require("./paymentRoutes");
const store = require("./storeRoutes");
module.exports = [users, store, payments];
