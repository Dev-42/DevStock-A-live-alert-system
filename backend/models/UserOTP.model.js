const mongoose = require("mongoose");

const userOTPSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  otp: { type: String, required: true },
  otpExpiresAt: { type: Date, required: true },
});

module.exports = mongoose.model("UserOTP", userOTPSchema);
