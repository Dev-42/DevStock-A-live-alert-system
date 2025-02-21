const express = require("express");
const {
  sendOTP,
  verifyOTP,
  logout,
} = require("../controllers/auth.controller");

const router = express.Router();

router.post("/signup", sendOTP);
router.post("/login", verifyOTP);
router.post("/logout", logout);

module.exports = router;
