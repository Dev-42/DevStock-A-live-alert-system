const {
  getStockDetails,
  connectStockWebSocket,
} = require("../services/stock.service");

exports.fetchStockDetails = async (req, res) => {
  try {
    const { symbol } = req.params;
    const stockDetails = await getStockDetails(symbol);

    if (!stockDetails) {
      return res.status(404).json({ message: "Stock not found" });
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Send initial stock details
    res.write(`data: ${JSON.stringify(stockDetails)}\n\n`);

    // Real-time price updates
    const ws = connectStockWebSocket(symbol, (stockData) => {
      if (stockData.data) {
        const latestPrice = stockData.data[0].p;
        console.log(`📊 ${symbol}: ${latestPrice}`);
        res.write(
          `data: ${JSON.stringify({ symbol, price: latestPrice })}\n\n`
        );
      }
    });

    req.on("close", () => {
      ws.close();
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching stock details", error: err.message });
  }
};
