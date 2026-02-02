const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");

const app = express();

/* =======================
   BASIC MIDDLEWARE
======================= */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "ytpromo_secret",
    resave: false,
    saveUninitialized: false,
  })
);

/* =======================
   VIEW ENGINE
======================= */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* =======================
   STATIC FILES
======================= */
app.use(express.static(path.join(__dirname, "public")));

/* =======================
   DATABASE CONNECTION
======================= */
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

/* =======================
   ROUTES
======================= */
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

// HOME
app.get("/", (req, res) => {
  res.render("home");
});

// DASHBOARD (protected)
app.get("/dashboard", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/auth/login");
  }
  res.render("dashboard");
});

/* =======================
   SERVER START
======================= */
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
