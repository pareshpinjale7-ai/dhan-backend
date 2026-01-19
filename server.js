const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// ===============================
// BASIC CONFIG
// ===============================
const DHAN_BASE_URL = "https://api.dhan.co";
const DHAN_TOKEN = process.env.DHAN_TOKEN;

// ===============================
// SYMBOL → SECURITY ID MAP
// (आत्ता sample आहेत – पुढे full F&O टाकू)
// ===============================
const SYMBOLS = {
  RELIANCE: "2885",
  TCS: "11536",
  INFY: "1594",
  HDFCBANK: "1333",
  ICICIBANK: "4963",
  SBIN: "3045"
};

// ===============================
// ROOT TEST API
// ===============================
app.get("/", (req, res) => {
  res.send("Dhan Backend Working ✅");
});

// ===============================
// PRICE API (SYMBOL BASED)
// ===============================
app.get("/api/price/:symbol", async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    const security_id = SYMBOLS[symbol];

    if (!security_id) {
      return res.status(400).json({
        error: "Symbol not found",
        message: "Security ID mapping missing"
      });
    }

    const response = await axios.post(
      `${DHAN_BASE_URL}/marketdata/quote`,
      {
        security_id: security_id,
        exchange_segment: "NSE_EQ"
      },
      {
        headers: {
          "access-token": DHAN_TOKEN,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({
      symbol: symbol,
      security_id: security_id,
      data: response.data
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      error: "Dhan API Error",
      message: "Failed to fetch price"
    });
  }
});

// ===============================
// SERVER START (RENDER SAFE)
// ===============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
