const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");
require("dotenv").config();

const app = express();

/* =========================
   MIDDLEWARE
========================= */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: "ytcoins_super_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

/* =========================
   VIEW ENGINE
========================= */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* =========================
   STATIC FILES (OPTIONAL)
========================= */
app.use(express.static(path.join(__dirname, "public")));

/* =========================
   DATABASE
========================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch(err => console.error("MongoDB connection error ❌", err));

/* =========================
   ROUTES
========================= */
app.use("/auth", require("./routes/auth"));
app.use("/video", require("./routes/video"));
app.use("/admin", require("./routes/admin"));
app.use("/analytics", require("./routes/analytics"));

/* =========================
   MAIN PAGES
========================= */
app.get("/", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/auth/login");
  }
  res.redirect("/dashboard");
});

app.get("/dashboard", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/auth/login");
  }
  res.render("dashboard", { user: req.session.user });
});

/* =========================
   404 HANDLER
========================= */
app.use((req, res) => {
  res.status(404).send("404 - Page Not Found ❌");
});

/* =========================
   SERVER START
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://127.0.0.1:${PORT}`);
});
