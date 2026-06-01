const express = require("express");
const cors = require("cors");

const app = express();

// ✅ FIX CORS (ALLOW FRONTEND)
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(express.json());

// routes
app.use("/api", require("./routes/githubRoutes"));

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});