const express = require("express");
const {
  fetchStockByName,
  streamStockPrice,
} = require("../controllers/stock.controller");

const router = express.Router();

router.get("/stocks/:symbol", fetchStockByName);
router.get("/stocks/stream/:symbol", streamStockPrice); // ✅ Real-time route

module.exports = router;
