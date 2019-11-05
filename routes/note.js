const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const Note = require("../models/Note");
const moment = require('moment');

// Adding this middleware inside of requests used to render routes will make the routes protected
const isLoggedIn = require("../middleware/isLoggedIn");

// GET request
// Get a specific note
router.get('/:id', isLoggedIn, async (req, res) => {
    // Find categories created by the user making the request
    const categories = await Category.find({ 'author.id': req.user._id });
    const notes = await Note.find({ 'author.id': req.user._id });

    // Find note created by the user making the request based on the note id
    // If there are errors, do not show any notes (empty array)
    // If everything is find, show the note
    Note.findById(req.params.id, function(error, note) {
        if (error) {
            res.render('dashboard/editNote', { moment: moment, note: note, notes: [], categories: [], pathname: '/dashboard' });
        } else {
            res.render('dashboard/editNote', { moment: moment, note: note, notes: notes, categories: categories, pathname: '/dashboard' }); 
            // "moment" is included in order to format dates on the client side
        }
    });
});

// POST request
// Create a new note
router.post('/', isLoggedIn, async (req, res) => {
    // Select category name based on the category chosen in the select field
    const categoryName = await Category.find({ _id: req.body.category }, { 'name': 1, '_id': 0 })
        .then((name) => { return name[0].name; })
        .catch((err) => { if (err) throw err; });
    
    // Create a new note
    // If there are no errors: save the note into the database and redirect them to '/dashboard'
    try {
        const newNote = new Note({
            title: req.body.title,
            body: req.body.body,
            category: {
                id: req.body.category,
                name: categoryName
            },
            author: {
                id: req.user._id,
                firstName: req.user.firstName,
                lastName: req.user.lastName
            }
        });

        newNote.save();

        res.redirect('/dashboard');
    } catch(err) {
        // If there are errors: send a 400 status along with an error
        res.status(400).send(err);
        res.render('dashboard');
    }
});

// POST request
// Edit a specific note
router.post('/:id', isLoggedIn, async (req, res) => {
    // Select category name based on the category chosen in the select field
    const categoryName = await Category.find({ _id: req.body.category }, { 'name': 1, '_id': 0 })
        .then((name) => { return name[0].name; })
        .catch((err) => { if (err) throw err; });


});

module.exports = router;
