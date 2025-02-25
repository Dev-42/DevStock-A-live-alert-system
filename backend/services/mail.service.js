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

exports.sendOTPEmail = async (email, otp) => {
  try {
    const info = await transporter.sendMail({
      from: `"DevTech Solutions" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It expires in 5 minutes.`,
    });

    console.log(`📧 OTP Email sent successfully: ${info.response}`);
  } catch (error) {
    console.error(`❌ Error sending OTP email to ${email}:`, error.message);
  }
};
