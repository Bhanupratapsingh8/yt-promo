const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,

  coins: { type: Number, default: 100 },

  dailyEarned: { type: Number, default: 0 },
  lastEarnDate: { type: String },
});

module.exports = mongoose.model("User", userSchema);
