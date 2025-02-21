const jwt = require("jsonwebtoken");

exports.generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

exports.generateJWT = (email) => {
  return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "24h" });
};
