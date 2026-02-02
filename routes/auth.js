const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

/* REGISTER PAGE */
router.get("/register", (req, res) => {
  res.render("register");
});

/* REGISTER USER */
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    username,
    email,
    password: hashedPassword,
    coins: 50,
    dailyCoins: 0,
  });

  await user.save();
  res.redirect("/auth/login");
});

/* LOGIN PAGE */
router.get("/login", (req, res) => {
  res.render("login");
});

/* LOGIN USER */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.send("User not found ❌");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.send("Wrong password ❌");

  req.session.user = user;
  res.redirect("/dashboard");
});

/* LOGOUT */
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/auth/login");
  });
});

module.exports = router;
