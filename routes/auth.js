const express = require('express');
const router = express.Router();

/* GET login page */
router.get('/login', (req, res) => {
  res.render('login');
});

/* GET register page */
router.get('/register', (req, res) => {
  res.render('register');
});

/* POST register */
router.post('/register', (req, res) => {
  // TEMP: no DB logic yet
  res.redirect('/auth/login');
});

/* POST login */
router.post('/login', (req, res) => {
  // TEMP: no auth logic yet
  res.redirect('/');
});

/* Logout */
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;
