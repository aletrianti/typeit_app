const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const Note = require("../models/Note");
const moment = require('moment');

// Adding this middleware inside of requests used to render routes will make the routes protected
const isLoggedIn = require("../middleware/isLoggedIn");

// GET request 
// Render the public dashboard
router.get('/', isLoggedIn, (req, res) => {
    res.render('publicDashboard', { pathname: '/dashboard/public' });
});

module.exports = router;