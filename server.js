require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");

const authRoutes = require("./routes/auth");

const app = express();

/* -------------------- MIDDLEWARE -------------------- */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

/* -------------------- VIEW ENGINE -------------------- */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* -------------------- ROUTES -------------------- */
app.get("/", (req, res) => {
  res.render("home");
});

app.use("/auth", authRoutes);

/* -------------------- DATABASE -------------------- */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

/* -------------------- SERVER -------------------- */
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
