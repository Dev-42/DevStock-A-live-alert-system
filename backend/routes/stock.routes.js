const express = require("express");
const { fetchStockDetails } = require("../controllers/stock.controller");

const router = express.Router();

router.get("/stocks/details/:symbol", fetchStockDetails);

module.exports = router;
