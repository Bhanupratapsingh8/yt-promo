// =====================
// IMPORTS
// =====================
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");
require("dotenv").config();

// =====================
// APP INIT
// =====================
const app = express();

// =====================
// MIDDLEWARE
// =====================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "yt-promo-secret",
    resave: false,
    saveUninitialized: false,
  })
);

// =====================
// VIEW ENGINE
// =====================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// =====================
// MONGODB CONNECTION (IMPORTANT PART)
// =====================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });

// =====================
// ROUTES
// =====================
app.get("/", (req, res) => {
  res.send("YT Promo app is running 🚀");
});

// =====================
// PORT (RENDER SAFE)
// =====================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
