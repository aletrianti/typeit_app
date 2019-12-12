const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const moment = require('moment');
const categoryValidation = require("../validation/authValidation").categoryValidation;

// Adding this middleware inside of requests used to render routes will make the routes protected
const isLoggedIn = require("../middleware/isLoggedIn");

// POST request
// Create a new category
router.post('/', isLoggedIn, async (req, res) => {
    // Validate the body of the request and, if there are errors, send the error message
    const validation = categoryValidation.validate(req.body);
    if (validation.error) {
        req.flash('error', validation.error.details[0].message);
        return res.redirect('back');
    }

    // Check if there is already a category (created by the current user) with the same name. If there is one, do not allow the user to create it again.
    const categoryName = await Category.find({ 'author.id': req.user._id, name: req.body.name }, { 'name': 1, '_id': 0 })
        .then((category) => { return category; })
        .catch((err) => { if (err) throw err; });

    // Create a new category
    // If there are no errors: save the category into the database and redirect them to '/dashboard'
    try {
        if (categoryName.length !== 0) {
            req.flash('error', 'Sorry, this category already exists.');
            res.redirect('back');
        } else {
            const newCategory = new Category({
                name: req.body.name,
                author: {
                    id: req.user._id,
                    firstName: req.user.firstName,
                    lastName: req.user.lastName
                }
            });
    
            newCategory.save();
    
            req.flash('success', 'Your category has been created.');
            res.redirect('/dashboard');
        }
    } catch(err) {
        req.flash('error', 'An error occurred. Please, try again.');
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
            req.flash('error', 'Sorry, this category already exists.');
            res.redirect('/dashboard');
        } else {
            Category.findByIdAndRemove({ _id: req.params.id }, (err) => {
            if (err) { console.log(err); }
                console.log('Document removed!');
            });

            req.flash('success', 'Your category has been deleted.');
            res.redirect('/dashboard');
        }
    } catch(err) {
        req.flash('error', 'An error occurred. Please, try again.');
        res.redirect('back');
    }
});

module.exports = router;
