// stock.service.js
const axios = require("axios");
const WebSocket = require("ws");
const StockAlert = require("../models/StockAlert.model");
const nodemailer = require("nodemailer");

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
const FINNHUB_WS_URL = `wss://ws.finnhub.io?token=${FINNHUB_API_KEY}`;

// Nodemailer setup
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmailAlert = async (email, symbol, targetPrice, currentPrice) => {
  console.log(`📧 Sending email to ${email} for ${symbol} at ${currentPrice}`);

  const mailOptions = {
    from: `"DevStock Alerts" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `📢 Stock Alert for ${symbol}: Target Price Set!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <div style="text-align: center; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
          <h2 style="color: #007bff; margin: 0;">📈 Stock Alert Notification</h2>
        </div>

        <p style="font-size: 16px; color: #333;">Hello,</p>
        <p style="font-size: 16px; color: #333;">Your stock alert for <strong>${symbol}</strong> has been successfully set.</p>

        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <p style="margin: 0; font-size: 16px;"><strong>📌 Target Price:</strong> $${targetPrice.toFixed(
            2
          )}</p>
          <p style="margin: 0; font-size: 16px;"><strong>📉 Current Price:</strong> ${
            currentPrice !== "N/A (Alert Created)"
              ? `$${currentPrice.toFixed(2)}`
              : "N/A"
          }</p>
        </div>

        <p style="font-size: 16px; color: #333;">
          We’ll notify you when the stock reaches your target price. Stay tuned!
        </p>

        <div style="text-align: center; margin-top: 20px;">
          <a href="https://yourwebsite.com/alerts" style="background: #007bff; color: #fff; text-decoration: none; padding: 10px 15px; border-radius: 5px; display: inline-block; font-size: 16px;">
            🔍 View Alerts
          </a>
        </div>

        <p style="font-size: 14px; color: #888; text-align: center; margin-top: 20px;">
          Need help? <a href="mailto:devbhattacharya42@gmail.com" style="color: #007bff; text-decoration: none;">Contact Support</a>
        </p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully: ${info.response}`);
  } catch (error) {
    console.error(`❌ Error sending email to ${email}:`, error.message);
  }
};

const checkStockAlerts = async () => {
  try {
    console.log("🔍 Checking stock alerts...");

    const alerts = await StockAlert.find({ isTriggered: false });
    if (alerts.length === 0) {
      console.log("✅ No pending alerts.");
      return;
    }

    for (const alert of alerts) {
      const stockData = await getStockDetails(alert.symbol);
      if (!stockData.currentPrice) continue;

      console.log(
        `📈 Checking ${alert.symbol}: Target ${alert.targetPrice}, Current ${stockData.currentPrice}`
      );

      if (stockData.currentPrice >= alert.targetPrice) {
        await sendEmailAlert(
          alert.email,
          alert.symbol,
          alert.targetPrice,
          stockData.currentPrice
        );
        await StockAlert.updateOne({ _id: alert._id }, { isTriggered: true });

        console.log(
          `✅ Alert triggered for ${alert.symbol} at ${stockData.currentPrice}`
        );
      }
    }
  } catch (error) {
    console.error("❌ Error checking stock alerts:", error.message);
  }
};
// Runs every 60 seconds
setInterval(checkStockAlerts, 60000);

const getStockDetails = async (symbol) => {
  try {
    const quoteUrl = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
    const profileUrl = `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`;

    const [quoteResponse, profileResponse] = await Promise.all([
      axios.get(quoteUrl),
      axios.get(profileUrl),
    ]);

    if (!quoteResponse.data || !profileResponse.data) {
      throw new Error("Invalid stock data received");
    }

    const stockData = {
      symbol,
      companyName: profileResponse.data.name || "Unknown",
      logo: profileResponse.data.logo || "",
      currentPrice: quoteResponse.data.c ?? quoteResponse.data.pc,
      previousClose: quoteResponse.data.pc,
    };
    return stockData;
  } catch (error) {
    console.error("Error fetching stock details:", error.message);
    return { error: "Unable to fetch stock details" };
  }
};

const connectStockWebSocket = (symbol, callback) => {
  const ws = new WebSocket(FINNHUB_WS_URL);

  ws.on("open", () => {
    console.log(`📡 Connected to Finnhub WebSocket for ${symbol}`);
    ws.send(JSON.stringify({ type: "subscribe", symbol }));
  });

  ws.on("close", () => {
    console.log(
      `❌ WebSocket closed for ${symbol}, attempting to reconnect...`
    );
    setTimeout(() => connectStockWebSocket(symbol, callback), 5000);
  });

  ws.on("error", (err) => console.log("⚠️ WebSocket Error:", err));

  ws.on("message", async (data) => {
    const stockData = JSON.parse(data);
    if (stockData.data) {
      const latestPrice = stockData.data[0].p;
      console.log(`📡 Real-time price update for ${symbol}: ${latestPrice}`);

      // Call the provided callback function
      callback(stockData);
    }
  });

  return ws;
};

module.exports = { getStockDetails, connectStockWebSocket, sendEmailAlert };
