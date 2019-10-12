const express = require("express");
const router = express.Router();
const passport = require("passport");

// GET request - renders the index page
router.get('/', (req, res) => {
    res.render('index');
});

// GET request - renders the login page
router.get('/login', (req, res) => {
    res.render('login');
});

// GET request - renders the register page
router.get('/register', (req, res) => {
    res.render('register');
});

module.exports = router;