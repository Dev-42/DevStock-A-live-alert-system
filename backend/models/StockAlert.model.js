const mongoose = require("mongoose");

const stockAlertSchema = new mongoose.Schema({
  email: { type: String, required: true },
  symbol: { type: String, required: true },
  targetPrice: { type: Number, required: true },
  isTriggered: { type: Boolean, default: false },
});

module.exports = mongoose.model("StockAlert", stockAlertSchema);
