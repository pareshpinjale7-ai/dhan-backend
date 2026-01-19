const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const DHAN_TOKEN = process.env.DHAN_TOKEN;

// SYMBOL → SECURITY ID
const SYMBOLS = {
  RELIANCE: "2885",
  TCS: "11536",
  INFY: "1594",
  HDFCBANK: "1333",
  ICICIBANK: "4963",
  SBIN: "3045"
};

// ROOT
app.get("/", (req, res) => {
  res.send("Dhan Backend Working ✅");
});

// ✅ LTP API – HEADER FIXED
app.get("/api/price/:symbol", async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    const security_id = SYMBOLS[symbol];

    if (!security_id) {
      return res.status(400).json({ error: "Symbol not mapped" });
    }

    const response = await axios.post(
      "https://api.dhan.co/marketdata/ltp",
      {
        instruments: [
          {
            security_id: security_id,
            exchange_segment: "NSE_EQ"
          }
        ]
      },
      {
        headers: {
          "accessToken": DHAN_TOKEN,   // 🔥 IMPORTANT FIX
          "Content-Type": "application/json"
        }
      }
    );

    res.json({
      symbol,
      security_id,
      dhan_data: response.data
    });

  } catch (err) {
    res.status(500).json({
      error: "LTP API FAILED",
      detail: err.response?.data || err.message
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
