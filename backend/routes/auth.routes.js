const express = require("express");
const {
  sendOTP,
  verifyOTP,
  logout,
  getProfile,
} = require("../controllers/auth.controller");
const authenticateUser = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/signup", sendOTP);
router.post("/login", verifyOTP);
router.post("/logout", logout);
router.get("/profile", authenticateUser, getProfile);

module.exports = router;
