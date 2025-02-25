const express = require("express");
const {
  fetchStockDetails,
  setStockAlert,
} = require("../controllers/stock.controller");

const router = express.Router();

// Route to fetch stock details
router.get("/stocks/details/:symbol", fetchStockDetails);

// Route to set a stock price alert
router.post("/stocks/alert", setStockAlert);

module.exports = router;
