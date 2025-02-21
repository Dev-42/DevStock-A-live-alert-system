const axios = require("axios");
const WebSocket = require("ws");

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
const FINNHUB_WS_URL = `wss://ws.finnhub.io?token=${FINNHUB_API_KEY}`;

const getStockPrice = async (symbol) => {
  const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
  const response = await axios.get(url);
  return response.data || { message: "Stock not found" };
};

// WebSocket Function to stream real-time prices
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

module.exports = { getStockPrice, connectStockWebSocket };
