const axios = require("axios");
const WebSocket = require("ws");

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
const FINNHUB_WS_URL = `wss://ws.finnhub.io?token=${FINNHUB_API_KEY}`;

const getStockDetails = async (symbol) => {
  try {
    // Fetch stock quote
    const quoteUrl = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
    const quoteResponse = await axios.get(quoteUrl);

    // Fetch stock profile (company name & logo)
    const profileUrl = `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
    const profileResponse = await axios.get(profileUrl);

    if (!quoteResponse.data || !profileResponse.data) {
      throw new Error("Invalid stock data received");
    }

    // Check if real-time data is available
    const isMarketOpen =
      quoteResponse.data.c !== null && quoteResponse.data.c !== undefined;

    const stockData = {
      symbol,
      companyName: profileResponse.data.name || "Unknown",
      logo: profileResponse.data.logo || "",
      currentPrice: isMarketOpen ? quoteResponse.data.c : quoteResponse.data.pc,
      previousClose: quoteResponse.data.pc,
      message: isMarketOpen
        ? "Real-time data available"
        : "Markets are closed, showing last closed price",
    };

    return stockData;
  } catch (error) {
    console.error("Error fetching stock details:", error.message);
    return { error: "Unable to fetch stock details" };
  }
};

// WebSocket function to stream real-time prices
const connectStockWebSocket = (symbol, callback) => {
  const ws = new WebSocket(FINNHUB_WS_URL);

  ws.on("open", () => {
    console.log(`📡 Connected to Finnhub WebSocket for ${symbol}`);
    ws.send(JSON.stringify({ type: "subscribe", symbol }));
  });

  ws.on("message", (data) => {
    const stockData = JSON.parse(data);
    callback(stockData);
  });

  ws.on("close", () => console.log("❌ WebSocket closed"));
  ws.on("error", (err) => console.log("⚠️ WebSocket Error:", err));

  return ws;
};

module.exports = { getStockDetails, connectStockWebSocket };
