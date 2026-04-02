require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json());

const port = process.env.PORT || 3000;

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
