const express = require("express");
const Video = require("../models/Video");
const User = require("../models/User");

const router = express.Router();
const ADMIN_EMAIL = "bhanupratapsingh4459@gmail.com";

/* USER ANALYTICS */
router.get("/user", async (req, res) => {
  if (!req.session.user) return res.redirect("/auth/login");

  const videos = await Video.find({ userEmail: req.session.user.email });

  const totalViews = videos.reduce((a, b) => a + b.views, 0);
  const totalVideos = videos.length;
  const promotedVideos = videos.filter(v => v.promoted).length;

  res.render("analytics-user", {
    user: req.session.user,
    totalVideos,
    totalViews,
    promotedVideos,
    videos,
  });
});

/* ADMIN ANALYTICS */
router.get("/admin", async (req, res) => {
  if (!req.session.user) return res.redirect("/auth/login");
  if (req.session.user.email !== ADMIN_EMAIL)
    return res.send("Access denied ❌");

  const users = await User.countDocuments();
  const videos = await Video.find();

  const totalViews = videos.reduce((a, b) => a + b.views, 0);
  const adminVideos = videos.filter(v => v.isAdminVideo).length;
  const userVideos = videos.length - adminVideos;

  res.render("analytics-admin", {
    users,
    videosCount: videos.length,
    totalViews,
    adminVideos,
    userVideos,
    videos,
  });
});

module.exports = router;
