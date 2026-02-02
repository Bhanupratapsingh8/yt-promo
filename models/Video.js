const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    title: String,
    youtubeLink: String,
    userEmail: String,
    isAdminVideo: { type: Boolean, default: false },

    watchedBy: [String],

    promoted: { type: Boolean, default: false },
    promoTarget: { type: Number, default: 0 },
    promoViews: { type: Number, default: 0 },

    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Video", videoSchema);
