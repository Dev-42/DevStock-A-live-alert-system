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

const sendEmailAlert = async (
  email,
  symbol,
  targetPrice,
  currentPrice,
  type
) => {
  console.log(
    `📧 Sending ${type} email to ${email} for ${symbol} at ${currentPrice}`
  );

  let subject, message, emoji;

  if (type === "setup") {
    subject = `✅ Stock Alert Set for ${symbol}!`;
    emoji = "📌";
    message = `
      <p>Great news! Your stock alert for <strong>${symbol}</strong> has been <strong>successfully set</strong>. 🎯</p>
      <p>We’ll keep an eye on it for you and notify you the moment it hits your target price of <strong>$${targetPrice.toFixed(
        2
      )}</strong>.</p>
      <p>Stay ahead in the market and happy investing! 🚀</p>
    `;
  } else if (type === "triggered") {
    subject = `🚀 Boom! ${symbol} Just Hit Your Target Price!`;
    emoji = "🔥";
    message = `
      <p>🚨 <strong>Breaking Alert!</strong> Your stock <strong>${symbol}</strong> has just <strong>hit your target price</strong> of <strong>$${targetPrice.toFixed(
      2
    )}</strong>!</p>
      <p>📈 The current price is now <strong>$${currentPrice.toFixed(
        2
      )}</strong>. Time to make your move!</p>
      <p>Check your portfolio and take action now! 💰💹</p>
    `;
  }

  const mailOptions = {
    from: `"DevStock Alerts" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `${emoji} ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 2px solid #007bff; border-radius: 12px; box-shadow: 2px 2px 10px rgba(0,0,0,0.1);">
        <div style="text-align: center; padding: 20px; background: #007bff; color: #fff; border-top-left-radius: 10px; border-top-right-radius: 10px;">
          <h2 style="margin: 0;">${emoji} ${subject}</h2>
        </div>

        <div style="padding: 20px; font-size: 16px; color: #333;">
          ${message}
        </div>

        <div style="text-align: center; margin-top: 20px;">
          <a href="https://yourwebsite.com/alerts" style="background: #007bff; color: #fff; text-decoration: none; padding: 12px 20px; border-radius: 8px; display: inline-block; font-size: 16px; font-weight: bold;">
            🔍 View Alerts Now
          </a>
        </div>

        <p style="font-size: 14px; color: #888; text-align: center; margin-top: 20px;">
          Need help? <a href="mailto:support@yourwebsite.com" style="color: #007bff; text-decoration: none;">Contact Support</a>
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

const checkStockAlerts = async (userEmail) => {
  try {
    console.log(`🔍 Checking stock alerts for ${userEmail}...`);

    // Find alerts that are not triggered and have a target price either above or below the current price
    const alerts = await StockAlert.find({
      isTriggered: false,
      email: userEmail,
    });

    console.log(`Alerts for ${userEmail}:`, alerts);

    if (alerts.length === 0) {
      console.log(`✅ No pending alerts for ${userEmail}.`);
      return;
    }

    for (const alert of alerts) {
      const stockData = await getStockDetails(alert.symbol);
      if (!stockData.currentPrice) continue;

      console.log(
        `📈 Checking ${alert.symbol} for ${userEmail}: Target ${alert.targetPrice}, Current ${stockData.currentPrice}`
      );

      // Check if target price is either above or below the current price
      if (
        stockData.currentPrice >= alert.targetPrice ||
        stockData.currentPrice <= alert.targetPrice
      ) {
        await sendEmailAlert(
          alert.email,
          alert.symbol,
          alert.targetPrice,
          stockData.currentPrice,
          (type = "triggered")
        );
        await StockAlert.updateOne({ _id: alert._id }, { isTriggered: true });

        console.log(
          `✅ Alert triggered for ${alert.symbol} at ${stockData.currentPrice} for ${userEmail}`
        );
      }
    }
  } catch (error) {
    console.error(
      `❌ Error checking stock alerts for ${userEmail}:`,
      error.message
    );
  }
};

// Runs every 60 seconds for all users
setInterval(async () => {
  const uniqueEmails = await StockAlert.distinct("email", {
    isTriggered: false,
  });
  uniqueEmails.forEach((email) => checkStockAlerts(email));
}, 60000);

// Runs every 60 seconds for all users
setInterval(async () => {
  const uniqueEmails = await StockAlert.distinct("email", {
    isTriggered: false,
  });
  uniqueEmails.forEach((email) => checkStockAlerts(email));
}, 60000);

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
