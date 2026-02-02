const express = require("express");
const router = express.Router();

/* =======================
   LOGIN PAGE
======================= */
router.get("/login", (req, res) => {
  res.render("login");
});

/* =======================
   REGISTER PAGE
======================= */
router.get("/register", (req, res) => {
  res.render("register");
});

/* =======================
   REGISTER (POST)
======================= */
router.post("/register", (req, res) => {
  // dummy user session (for now)
  req.session.user = {
    email: req.body.email || "test@user.com",
  };

  res.redirect("/dashboard");
});

/* =======================
   LOGIN (POST)
======================= */
router.post("/login", (req, res) => {
  req.session.user = {
    email: req.body.email || "test@user.com",
  };

  res.redirect("/dashboard");
});

/* =======================
   LOGOUT
======================= */
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

module.exports = router;
