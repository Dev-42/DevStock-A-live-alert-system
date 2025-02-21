const express = require("express");
const { getProfile } = require("../controllers/user.controller");
const authenticateUser = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/profile", authenticateUser, getProfile);

module.exports = router;
