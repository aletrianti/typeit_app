const express = require("express");
const router = express.Router();

// Adding this middleware inside of requests used to render routes will make the routes protected
const isLoggedIn = require("../middleware/isLoggedIn");

// GET request - renders the dashboard
router.get('/', isLoggedIn, (req, res) => {
    res.render('dashboard');
});

module.exports = router;