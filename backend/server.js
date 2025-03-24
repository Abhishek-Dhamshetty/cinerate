require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const movieApp=require("./apis/movieApi")
// Load environment variables from .env file
const PORT = process.env.PORT || 9000;
const DBURL = process.env.DBURL || "mongodb://127.0.0.1:27017/cinerate";

const app = express();

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(cors()); // Enable CORS

// Connect to MongoDB
mongoose
  .connect(DBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((error) => console.error("❌ MongoDB Connection Error:", error));

app.use('/movie-api',movieApp)

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});