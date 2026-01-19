const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

const DHAN_API = "https://api.dhan.co";
const TOKEN = process.env.DHAN_TOKEN;

// TEST API
app.get("/", (req, res) => {
  res.send("Dhan Backend Working ✅");
});

// LIVE PRICE API
app.get("/api/price/:symbol", async (req, res) => {
  try {
    const symbols = require("./symbols");

app.get("/api/price/:symbol", async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    const security_id = symbols[symbol];

    if (!security_id) {
      return res.json({ error: "Symbol not found" });
    }

    const response = await axios.post(
      "https://api.dhan.co/marketdata/quote",
      {
        security_id: security_id,
        exchange_segment: "NSE_EQ"
      },
      {
        headers: {
          "access-token": process.env.DHAN_TOKEN,
          "Content-Type": "application/json"
        }
      }
    );

    res.json(response.data);
  } catch (err) {
    res.json({ error: "Dhan API error" });
  }
});

