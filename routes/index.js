const users = require("./userRoutes");
const payments = require("./paymentRoutes");
const store = require("./storeRoutes");
const voucher = require("./voucherRoutes");
module.exports = [users, store, payments, voucher];
