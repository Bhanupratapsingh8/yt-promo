const express = require("express");
const Video = require("../models/Video");
const User = require("../models/User");
const { isLoggedIn } = require("../middleware/auth");

const router = express.Router();
const ADMIN_EMAIL = "bhanupratapsingh4459@gmail.com";

const DAILY_LIMIT = 1000; // max coins per day

/* ADD VIDEO */
router.get("/add", isLoggedIn, (req, res) => {
  res.render("addvideo", { user: req.session.user });
});

router.post("/add", isLoggedIn, async (req, res) => {
  const { title, youtubeLink, promoCoins } = req.body;
  const isAdmin = req.session.user.email === ADMIN_EMAIL;

  let promoted = false;
  let promoTarget = 0;

  if (isAdmin) {
    promoted = true;
    promoTarget = 100000;
  } else {
    const user = await User.findOne({ email: req.session.user.email });
    const promo = Number(promoCoins || 0);

    if (promo > 0 && user.coins >= promo) {
      user.coins -= promo;
      promoted = true;
      promoTarget = promo;
      await user.save();
      req.session.user = user;
    }
  }

  await Video.create({
    title,
    youtubeLink,
    userEmail: req.session.user.email,
    isAdminVideo: isAdmin,
    promoted,
    promoTarget,
    promoViews: 0,
    watchedBy: [],
    views: 0,
  });

  res.redirect("/dashboard");
});

/* WATCH VIDEO */
router.get("/watch", isLoggedIn, async (req, res) => {
  const videos = await Video.find({
    watchedBy: { $ne: req.session.user.email },
  }).sort({ isAdminVideo: -1, promoted: -1, createdAt: 1 });

  const video = videos.find(v => !v.promoted || v.promoViews < v.promoTarget);
  if (!video) return res.send("No more videos 🎉");

  // store watch start time (anti-cheat)
  req.session.watchStart = Date.now();

  res.render("watch", { video });
});

/* EARN COINS (SECURE) */
router.post("/earn", isLoggedIn, async (req, res) => {
  const watchTime = Date.now() - (req.session.watchStart || 0);
  if (watchTime < 30000) {
    return res.send("Watch time too short ❌");
  }

  const video = await Video.findById(req.body.videoId);
  if (!video) return res.redirect("/video/watch");

  if (video.watchedBy.includes(req.session.user.email)) {
    return res.redirect("/video/watch");
  }

  const user = await User.findOne({ email: req.session.user.email });

  // daily limit check
  const today = new Date().toDateString();
  if (user.lastEarnDate !== today) {
    user.dailyEarned = 0;
    user.lastEarnDate = today;
  }

  if (user.dailyEarned >= DAILY_LIMIT) {
    return res.send("Daily earning limit reached ❌");
  }

  // update video
  video.watchedBy.push(user.email);
  video.views += 1;

  if (video.promoted) {
    video.promoViews += 1;
    if (video.promoViews >= video.promoTarget) {
      video.promoted = false;
    }
  }

  await video.save();

  // admin does not earn coins
  if (user.email !== ADMIN_EMAIL) {
    user.coins += 20;
    user.dailyEarned += 20;
    await user.save();
    req.session.user = user;
  }

  res.redirect("/video/watch");
});

module.exports = router;
