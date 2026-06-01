require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("GitHub Profile Analyzer API is running");
});

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

app.use("/api", require("./routes/githubRoutes"));

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
