const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");

const app = express();

/* =========================
   BASIC CONFIG
========================= */

const PORT = process.env.PORT || 10000;
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error("❌ MongoDB URI not found in environment variables");
  process.exit(1);
}

/* =========================
   MIDDLEWARE
========================= */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "ytpromo_secret",
    resave: false,
    saveUninitialized: false,
  })
);

/* =========================
   VIEW ENGINE
========================= */

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* =========================
   MONGODB CONNECTION
========================= */

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });

/* =========================
   ROUTES
========================= */

// HOME PAGE
app.get("/", (req, res) => {
  res.render("home"); // <-- THIS SHOWS home.ejs
});

// LOGIN PAGE
app.get("/login", (req, res) => {
  res.render("login");
});

// REGISTER PAGE
app.get("/register", (req, res) => {
  res.render("register");
});

// DASHBOARD (example protected page)
app.get("/dashboard", (req, res) => {
  res.render("dashboard");
});

// HEALTH CHECK (optional but useful)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is healthy" });
});

/* =========================
   SERVER START
========================= */

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
