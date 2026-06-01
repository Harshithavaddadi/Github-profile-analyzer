require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🚀 GitHub Profile Analyzer API is Running");
});

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

app.use("/api", require("./routes/githubRoutes"));

module.exports = app;