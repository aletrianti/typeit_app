const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const Note = require("../models/Note");

// Adding this middleware inside of requests used to render routes will make the routes protected
const isLoggedIn = require("../middleware/isLoggedIn");

// GET request 
// Render the dashboard
router.get('/', isLoggedIn, (req, res) => {
    Note.find({}, function(error, notes) {
        if (error) {
            res.render('dashboard');
        } else {
            res.render('dashboard', { notes: notes });
        }
    });
});

// POST request
// Create a new category
router.post('/categories', isLoggedIn, async (req, res) => {
    // Create a new category
    // If there are no errors: save the category into the database and redirect them to '/dashboard'
    try {
        const newCategory = new Category({
            name: req.body.name,
            author: {
                authorId: req.user._id,
                firstName: req.user.firstName,
                lastName: req.user.lastName
            }
        });

        newCategory.save();

        res.redirect('dashboard');
    } catch(err) {
        // If there are errors: send a 400 status along with an error
        res.status(400).send(err);
        res.render('dashboard');
    }
});

// POST request
// Edit a category
router.post('/categories/:id', isLoggedIn, (req, res) => {

});

// GET request
// Get a specific note
router.get('/notes/:id', isLoggedIn, (req, res) => {
    
});

// POST request
// Create a new note
router.post('/notes', isLoggedIn, (req, res) => {
    // Create a new note
    // If there are no errors: save the note into the database and redirect them to '/dashboard'
    try {
        const newNote = new Note({
            title: req.body.title,
            body: req.body.body,
            category: {
                categoryId: req.category._id,
                name: req.category.name
            },
            author: {
                authorId: req.user._id,
                firstName: req.user.firstName,
                lastName: req.user.lastName
            }
        });

        newNote.save();

        res.redirect('dashboard');
    } catch(err) {
        // If there are errors: send a 400 status along with an error
        res.status(400).send(err);
        res.render('dashboard');
    }
});

// POST request
// Edit a note
router.post('/notes/:id', isLoggedIn, (req, res) => {

});

module.exports = router;