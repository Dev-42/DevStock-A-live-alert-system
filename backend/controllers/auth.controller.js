const {
  sendOTPService,
  verifyOTPService,
} = require("../services/auth.service");

exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    await sendOTPService(email);
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

    const token = await verifyOTPService(email, otp);
    res.cookie("authCookie", token, { httpOnly: true, maxAge: 86400000 }); // 1 day

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

exports.getProfile = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching profile", error: err.message });
  }
};
