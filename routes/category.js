const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const Note = require("../models/Note");
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

// GET request
// Get a specific category
router.get('/:id', isLoggedIn, async (req, res) => {
    // Find categories and notes created by the user making the request
    const categories = await Category.find({ 'author.id': req.user._id });
    const notes = await Note.find({ 'author.id': req.user._id });

    // Find category created by the user making the request based on the category id
    // If there are errors, do not show any categories (empty array)
    // If everything is find, show the category
    Category.findById(req.params.id, function(error, category) {
        if (error) {
            res.render('dashboard/editCategory', { 
                moment: moment, 
                category: category, 
                notes: [], 
                categories: [], 
                pathname: '/dashboard' 
            });
        } else {
            res.render('dashboard/editCategory', { 
                // "moment" is included in order to format dates on the client side
                moment: moment, 
                category: category, 
                notes: notes, 
                categories: categories, 
                pathname: '/dashboard' 
            }); 
        }
    });
});

// POST request
// Edit a specific category
router.post('/:id/edit', isLoggedIn, async (req, res) => {
    // Validate the body of the request and, if there are errors, send the error message
    const validation = categoryValidation.validate(req.body);
    if (validation.error) {
        req.flash('error', validation.error.details[0].message);
        return res.redirect('back');
    }

    // Check if there is already a category (created by the current user) with the same name. 
    // If there is one, and its id is not the same as the category being edited, do not allow the user to edit the category with that name.
    const categoryName = await Category.find({ 'author.id': req.user._id, name: req.body.name, _id: { '$ne': req.params.id } }, { 'name': 1, '_id': 1 })
        .then((category) => { return category; })
        .catch((err) => { if (err) throw err; });

    if (categoryName.length !== 0) {
        req.flash('error', 'Sorry, try a different name.');
        res.redirect('back');
    } else {
        // Find a category with a specific id and update based on the data from the form
        Category.findOneAndUpdate({ _id: req.params.id }, {
            $set: {
                name: req.body.name
            }
        }, 
        { new: true }, // Return the newly updated version of the document
        (err, category) => {
            if (err) { console.log(err); }
        });

        // Change the category's name inside notes, if used
        try {
            const noteCategory = await Note.find({ 'author.id': req.user._id, 'category.id': req.params.id })
                .then((notes) => { return notes; })
                .catch((err) => { if (err) throw err; });

            // console.log(noteCategory);

            noteCategory.forEach((note) => {
                console.log('Note: ' + note);
                console.log('Note title: ' + note.title);
                Note.findOneAndUpdate({ _id: note._id }, {
                    $set: {
                        category: { 
                            name: req.body.name 
                        }
                    }
                }, { new: true }, 
                (err, note) => {
                    if (err) { console.log(err); }
                });
            });
        } catch(err) {
            console.log(err);
        }

        req.flash('success', 'Your category has been edited.');
        res.redirect('back');
    }
});

// POST request
// Delete a category
router.post('/:id/delete', isLoggedIn, async (req, res) => {
    const noteCategory = await Note.find({ 'author.id': req.user._id, 'category.id': req.params.id })
        .then((note) => { return note; })
        .catch((err) => { if (err) throw err; });

    try {
        if (noteCategory.length !== 0) {
            req.flash('error', 'Sorry, this category is currently being used in a note.');
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
