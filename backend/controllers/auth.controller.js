const { sendOTPEmail } = require("../services/mail.service");
const { generateOTP, generateJWT } = require("../services/auth.service");
const UserOTP = require("../models/UserOTP.model");
const User = require("../models/User.model");

exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 5 * 60000);

    await UserOTP.findOneAndUpdate(
      { email },
      { otp, otpExpiresAt },
      { upsert: true, new: true }
    );

    await sendOTPEmail(email, otp);

    res.json({ message: "OTP sent successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Error sending OTP", error: err.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ message: "Email and OTP are required" });

    const userOTP = await UserOTP.findOne({ email });
    if (!userOTP) return res.status(400).json({ message: "User not found" });

    if (userOTP.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    if (new Date() > userOTP.otpExpiresAt)
      return res.status(400).json({ message: "OTP expired" });

    let user = await User.findOne({ email });
    if (!user) user = await User.create({ email });

    const token = generateJWT(email);

    res.cookie("authCookie", token, {
      httpOnly: true,
      maxAge: 86400000,
    });

    res.json({ message: "OTP verified successfully!", token });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error verifying OTP", error: err.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("authCookie");
  res.json({ message: "Logged out successfully" });
};
