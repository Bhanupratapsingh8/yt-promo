const express = require("express");
const Video = require("../models/Video");
const { isAdmin } = require("../middleware/auth");

const router = express.Router();

router.get("/panel", isAdmin, async (req, res) => {
  const videos = await Video.find().sort({ createdAt: -1 });
  res.render("admin", { videos });
});

module.exports = router;
