const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const moment = require('moment');

// Adding this middleware inside of requests used to render routes will make the routes protected
const isLoggedIn = require("../middleware/isLoggedIn");

// POST request
// Create a new category
router.post('/', isLoggedIn, async (req, res) => {
    // Create a new category
    // If there are no errors: save the category into the database and redirect them to '/dashboard'
    try {
        const newCategory = new Category({
            name: req.body.name,
            author: {
                id: req.user._id,
                firstName: req.user.firstName,
                lastName: req.user.lastName
            }
        });

        newCategory.save();

        res.redirect('back');
    } catch(err) {
        // If there are errors: send a 400 status along with an error
        res.status(400).send(err);
        res.redirect('back');
    }
});

// POST request
// Edit a category
router.post('/:id', isLoggedIn, (req, res) => {

});

module.exports = router;
