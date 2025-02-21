const {
  getStockPrice,
  connectStockWebSocket,
} = require("../services/stock.service");

exports.fetchStockByName = async (req, res) => {
  try {
    const { symbol } = req.params;
    const stockData = await getStockPrice(symbol);
    res.json(stockData);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching stock price", error: err.message });
  }
};

// Real-time Stock Price Streaming (SSE)
exports.streamStockPrice = (req, res) => {
  const { symbol } = req.params;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const ws = connectStockWebSocket(symbol, (stockData) => {
    if (stockData.data) {
      const latestPrice = stockData.data[0].p;
      console.log(`📊 ${symbol}: ${latestPrice}`);
      res.write(`data: ${JSON.stringify({ symbol, price: latestPrice })}\n\n`);
    }
  });

  req.on("close", () => {
    ws.close();
  });
};
