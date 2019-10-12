const express = require("express");
const router = express.Router();
const passport = require("passport");

// GET request - renders the dashboard
router.get('/', (req, res) => {
    res.render('dashboard');
});

module.exports = router;