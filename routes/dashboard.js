const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const Note = require("../models/Note");
const moment = require('moment');

// Adding this middleware inside of requests used to render routes will make the routes protected
const isLoggedIn = require("../middleware/isLoggedIn");

// GET request 
// Render the dashboard
router.get('/', isLoggedIn, async (req, res) => {
    // Find categories created by the user making the request
    const categories = await Category.find({ 'author.id': req.user._id });
    // Find notes that include the current user as a participant
    const sharedNotes = await Note.find({ participants: { '$elemMatch': { _id: req.user._id } } });

    // Find notes created by the user making the request
    // If there are errors, do not show any notes or categories(empty array)
    // If everything is find, show the notes and categories
    Note.find({ 'author.id': req.user._id }, (error, notes) => {
        if (error) {
            res.render('dashboard', { 
                // "moment" is included in order to format dates on the client side
                moment: moment, 
                notes: [], 
                sharedNotes: [],
                categories: [], 
                pathname: '/dashboard' 
            });
        } else {
            res.render('dashboard', { 
                moment: moment, 
                notes: notes, 
                sharedNotes: sharedNotes,
                categories: categories, 
                pathname: '/dashboard' 
            }); 
        }
    });

});

// GET request 
// Render the dashboard with the "add note" form
router.get('/new-note', isLoggedIn, async (req, res) => {
    // Find categories created by the user making the request
    const categories = await Category.find({ 'author.id': req.user._id });
    // Find notes that include the current user as a participant
    const sharedNotes = await Note.find({ participants: { '$elemMatch': { _id: req.user._id } } });

    // Find notes created by the user making the request
    // If there are errors, do not show any notes (empty array)
    // If everything is find, show the notes
    Note.find({ 'author.id': req.user._id }, (error, notes) => {
        if (error) {
            res.render('dashboard/addNote', { 
                // "moment" is included in order to format dates on the client side
                moment: moment, 
                notes: [], 
                sharedNotes: [],
                categories: [], 
                pathname: '/dashboard' 
            });
        } else {
            res.render('dashboard/addNote', { 
                moment: moment, 
                notes: notes, 
                sharedNotes: sharedNotes,
                categories: categories, 
                pathname: '/dashboard' 
            }); 
        }
    });
});

// GET request 
// Render the dashboard with the "add category" form
router.get('/new-category', isLoggedIn, async (req, res) => {
    // Find categories created by the user making the request
    const categories = await Category.find({ 'author.id': req.user._id });
    // Find notes that include the current user as a participant
    const sharedNotes = await Note.find({ participants: { '$elemMatch': { _id: req.user._id } } });

    // Find notes created by the user making the request
    // If there are errors, do not show any notes (empty array)
    // If everything is find, show the notes
    Note.find({ 'author.id': req.user._id }, (error, notes) => {
        if (error) {
            res.render('dashboard/addCategory', { 
                // "moment" is included in order to format dates on the client side
                moment: moment, 
                notes: [], 
                sharedNotes: [],
                categories: [], 
                pathname: '/dashboard' 
            });
        } else {
            res.render('dashboard/addCategory', { 
                moment: moment, 
                notes: notes, 
                sharedNotes: sharedNotes,
                categories: categories, 
                pathname: '/dashboard' 
            }); 
        }
    });
});

module.exports = router;