require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const UserOTP = require("./models/UserOTP.model");
const User = require("./models/User.model");
// const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const authenticateUser = require("./middleware/auth.middleware");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors());

// Connect to MongoDB

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // Use `true` for port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Function to generate OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// Function to generate JWT Token
const generateJWT = (email) => {
  return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "24h" });
};
// 📌 API: Send OTP to User's Email
app.post("/signup", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const otp = generateOTP(); // Generate OTP
    const otpExpiresAt = new Date(Date.now() + 5 * 60000); // Expires in 5 minutes

    // Store OTP in MongoDB (update if user exists)
    await UserOTP.findOneAndUpdate(
      { email },
      { otp, otpExpiresAt },
      { upsert: true, new: true }
    );

    // Send email
    await transporter.sendMail({
      from: `"DevTech Solutions" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It expires in 5 minutes.`,
    });

    res.json({ message: "OTP sent successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Error sending OTP", error: err.message });
  }
});

// 📌 API: Verify OTP
app.post("/login", async (req, res) => {
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

    // OTP is valid ✅, Store user in the Verified Users collection
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email }); // Create new verified user
    }

    // Delete OTP from database
    // await UserOTP.deleteOne({ email });

    // Generate JWT Token
    const token = generateJWT(email);
    // Set token in HTTP-only cookie
    res.cookie("authCookie", token, {
      httpOnly: true,
      maxAge: 86400000, // 1 day
    });

    res.json({ message: "OTP verified successfully!", token });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error verifying OTP", error: err.message });
  }
});

// Logout Route - Clears cookie
app.post("/logout", (req, res) => {
  res.clearCookie("authCookie");
  res.json({ message: "Logged out successfully" });
});

app.get("/profile", authenticateUser, async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching profile", error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
