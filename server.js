const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();

/* =======================
   BASIC MIDDLEWARE
======================= */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* =======================
   VIEW ENGINE
======================= */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/* =======================
   STATIC FILES
======================= */
app.use(express.static(path.join(__dirname, 'public')));

/* =======================
   SESSION (FIXED ERROR)
======================= */
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'fallback_secret',
    resave: false,
    saveUninitialized: false,
  })
);

/* =======================
   MONGODB CONNECTION
======================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err.message));

/* =======================
   ROUTES
======================= */
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

/* =======================
   HOME ROUTE
======================= */
app.get('/', (req, res) => {
  res.render('home');
});

/* =======================
   SERVER START
======================= */
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
