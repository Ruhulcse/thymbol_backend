const users = require("./userRoutes");
const payments = require("./paymentRoutes");
const store = require("./storeRoutes");
const voucher = require("./voucherRoutes");
const auth = require("./auth");
const category = require("./categoryRoutes");
const passwordReset = require("./passwordResetRoutes");
const qrcode = require("./qrcodeRoutes");
module.exports = [
  users,
  store,
  payments,
  auth,
  voucher,
  category,
  passwordReset,
  qrcode,
];
