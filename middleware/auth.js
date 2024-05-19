const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel.js");

const protect = asyncHandler(async (req, res, next) => {
  // console.log("function called ", req.headers);
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      // console.log(decoded);
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, not token");
  }
});

const IsSupperadmin = (req, res, next) => {
  if (req.user && req.user.userType === "supperadmin") {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as a supperadmin");
  }
};

module.exports = {
  protect,
  IsSupperadmin,
};
