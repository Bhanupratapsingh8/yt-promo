require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');

const app = express();

/* ================== BASIC MIDDLEWARE ================== */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* ================== VIEW ENGINE ================== */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/* ================== STATIC FILES ================== */
app.use(express.static(path.join(__dirname, 'public')));

/* ================== SESSION (FIXED) ================== */
app.use(
  session({
    secret: process.env.SESSION_SECRET, // ✅ REQUIRED
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // secure:true only with HTTPS
  })
);

/* ================== MONGODB CONNECT ================== */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err));

/* ================== ROUTES ================== */

// Home
app.get('/', (req, res) => {
  res.render('home');
});

// Auth pages
app.get('/auth/login', (req, res) => {
  res.render('login');
});

app.get('/auth/register', (req, res) => {
  res.render('register');
});

// Auth form handlers (TEMP – no DB yet)
app.post('/auth/login', (req, res) => {
  res.send('Login working (backend connected)');
});

app.post('/auth/register', (req, res) => {
  res.send('Register working (backend connected)');
});

/* ================== SERVER ================== */
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
