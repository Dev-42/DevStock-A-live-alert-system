const {
  getStockDetails,
  connectStockWebSocket,
  sendEmailAlert,
} = require("../services/stock.service");
const StockAlert = require("../models/StockAlert.model");
const User = require("../models/User.model");

exports.fetchStockDetails = async (req, res) => {
  try {
    const { symbol } = req.params;
    const stockDetails = await getStockDetails(symbol);

    if (!stockDetails) {
      return res.status(404).json({ message: "Stock not found" });
    }

    // Set headers for SSE (Server-Sent Events)
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Send initial stock details
    res.write(`data: ${JSON.stringify(stockDetails)}\n\n`);

    // Establish WebSocket connection
    const ws = connectStockWebSocket(symbol, (stockData) => {
      if (stockData.data) {
        const latestPrice = stockData.data[0].p;
        console.log(`📊 ${symbol}: ${latestPrice}`);

        // Send updated stock price to the client
        res.write(
          `data: ${JSON.stringify({ symbol, price: latestPrice })}\n\n`
        );
      }
    });

    // Handle client disconnect
    req.on("close", () => {
      console.log(`❌ Connection closed by client for ${symbol}`);
      ws.close();
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching stock details",
      error: err.message,
    });
  }
};

exports.setStockAlert = async (req, res) => {
  try {
    const { email, symbol, targetPrice } = req.body;

    if (!email || !symbol || !targetPrice) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (!userExists) {
      return res.status(404).json({ message: "User email not registered" });
    }

    const price = parseFloat(targetPrice);
    if (isNaN(price) || price <= 0) {
      return res.status(400).json({ message: "Invalid target price" });
    }

    // Fetch current stock price
    const stockDetails = await getStockDetails(symbol);
    if (!stockDetails || !stockDetails.currentPrice) {
      return res
        .status(400)
        .json({ message: "Invalid stock symbol or no data available" });
    }

    const newAlert = new StockAlert({
      email,
      symbol,
      targetPrice: price,
      isTriggered: false,
    });

    await newAlert.save();

    // Send confirmation email
    await sendEmailAlert(email, symbol, price, stockDetails.currentPrice);

    return res.status(201).json({
      message: "Stock alert set successfully. Confirmation email sent.",
      alert: newAlert,
    });
  } catch (err) {
    console.error("❌ Error setting stock alert:", err.message);
    return res.status(500).json({
      message: "Error setting stock alert",
      error: err.message,
    });
  }
};
