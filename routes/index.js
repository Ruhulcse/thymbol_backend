const users = require("./userRoutes");
const payments = require("./paymentRoutes");
const store = require("./storeRoutes");
const voucher = require("./voucherRoutes");
const auth = require("./auth");
const category = require("./categoryRoutes");
const qrcode = require("./qrcodeRoutes");
const passwordReset = require("./passwordResetRoutes");
const pushNotification = require("./pushNotificationRoutes");
const review = require("./reviewRoutes");

module.exports = [
  users,
  store,
  payments,
  auth,
  voucher,
  category,
  passwordReset,
  pushNotification,
  qrcode,
  review,
];
