const UserOTP = require("../models/UserOTP.model");
const User = require("../models/User.model");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();
const generateJWT = (email) =>
  jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "24h" });

exports.sendOTPService = async (email) => {
  const otp = generateOTP();
  const otpExpiresAt = new Date(Date.now() + 5 * 60000);

  await UserOTP.findOneAndUpdate(
    { email },
    { otp, otpExpiresAt },
    { upsert: true }
  );

  await transporter.sendMail({
    from: `"DevTech Solutions" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}. It expires in 5 minutes.`,
  });
};

exports.verifyOTPService = async (email, otp) => {
  const userOTP = await UserOTP.findOne({ email });
  if (!userOTP || userOTP.otp !== otp || new Date() > userOTP.otpExpiresAt) {
    throw new Error("Invalid or expired OTP");
  }

  let user = await User.findOne({ email });
  if (!user) user = await User.create({ email });

  return generateJWT(email);
};
