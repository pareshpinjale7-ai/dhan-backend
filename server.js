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
    const symbol = req.params.symbol;

    const response = await axios.post(
      `${DHAN_API}/marketdata/quote`,
      {
        security_id: symbol,
        exchange_segment: "NSE_EQ"
      },
      {
        headers: {
          "access-token": TOKEN,
          "Content-Type": "application/json"
        }
      }
    );

    res.json(response.data);
  } catch (e) {
    res.json({ error: "Data not found" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
