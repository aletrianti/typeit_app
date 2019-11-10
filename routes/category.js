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
        res.redirect('back');
    }
});

// POST request
// Delete a category
router.post('/:id', isLoggedIn, async (req, res) => {
    const noteCategory = await Note.find({ 'author.id': req.user._id, 'category.id': req.params.id })
        .then((note) => { return note; })
        .catch((err) => { if (err) throw err; });

    try {
        if (noteCategory.length !== 0) {
            res.redirect('back');
        } else {
            Category.findByIdAndRemove({ _id: req.params.id }, (err) => {
            if (err) { console.log(err); }
                console.log('Document removed!');
            });

            res.redirect('back');
        }
    } catch(err) {
        console.log(err);
        res.redirect('back');
    }
});

module.exports = router;
