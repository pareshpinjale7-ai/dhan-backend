const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ DHAN V2 BASE
const DHAN_BASE_URL = "https://api.dhan.co/v2";
const DHAN_TOKEN = process.env.DHAN_TOKEN;

// SYMBOL → SECURITY ID (sample)
const SYMBOLS = {
  RELIANCE: "2885",
  TCS: "11536",
  INFY: "1594",
  HDFCBANK: "1333",
  ICICIBANK: "4963",
  SBIN: "3045"
};

// ROOT CHECK
app.get("/", (req, res) => {
  res.send("Dhan Backend Working ✅");
});

// ✅ PRICE API (100% CORRECT)
app.get("/api/price/:symbol", async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    const security_id = SYMBOLS[symbol];

    if (!security_id) {
      return res.status(400).json({ error: "Symbol not mapped" });
    }

    const response = await axios.post(
      `${DHAN_BASE_URL}/marketdata/quote`,
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
          "access-token": DHAN_TOKEN,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({
      symbol,
      security_id,
      dhan_response: response.data
    });

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({
      error: "PRICE API FAILED",
      detail: err.response?.data || err.message
    });
  }
});

// RENDER SAFE PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
