const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const Note = require("../models/Note");
const User = require("../models/User");
const moment = require('moment');
const noteValidation = require("../validation/authValidation").noteValidation;

// Adding this middleware inside of requests used to render routes will make the routes protected
const isLoggedIn = require("../middleware/isLoggedIn");

// GET request
// Get a specific note
router.get('/:id', isLoggedIn, async (req, res) => {
    // Find categories created by the user making the request
    const categories = await Category.find({ 'author.id': req.user._id });
    const notes = await Note.find({ 'author.id': req.user._id });
    const sharedNotes = await Note.find({ participants: { '$elemMatch': { _id: req.user._id } } });

    // Find note created by the user making the request based on the note id
    // If there are errors, do not show any notes (empty array)
    // If everything is find, show the note
    Note.findById(req.params.id, (error, note) => {
        if (error) {
            res.render('dashboard/editNote', { 
                moment: moment, 
                note: note, 
                notes: [], 
                sharedNotes: [],
                categories: [], 
                pathname: '/dashboard' 
            });
        } else {
            res.render('dashboard/editNote', { 
                // "moment" is included in order to format dates on the client side
                moment: moment, 
                note: note, 
                notes: notes, 
                sharedNotes: sharedNotes,
                categories: categories, 
                pathname: '/dashboard' 
            }); 
        }
    });
});

// POST request
// Create a new note
router.post('/', isLoggedIn, async (req, res) => {
    // Validate the body of the request and, if there are errors, send the error message
    const validation = noteValidation.validate(req.body);
    if (validation.error) {
        req.flash('error', validation.error.details[0].message);
        return res.redirect('back');
    }

    // Check if there is already a note (created by the current user) with the same title. If there is one, do not allow the user to create it again.
    const noteTitle = await Note.find({ 'author.id': req.user._id, title: req.body.title }, { 'title': 1, '_id': 0 })
        .then((note) => { return note; })
        .catch((err) => { if (err) throw err; });

    // Select category name based on the category chosen in the select field
    const categoryName = await Category.find({ 'author.id': req.user._id, _id: req.body.category }, { 'name': 1, '_id': 0 })
        .then((name) => { return name[0].name; })
        .catch((err) => { if (err) throw err; });
    
    // Create a new note
    // If there are no errors: save the note into the database and redirect the user to '/dashboard'
    if (noteTitle.length !== 0) {
        req.flash('error', 'Sorry, this note already exists.');
        res.redirect('back');
    } else {
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

        req.flash('success', 'Your note has been created.');
        res.redirect('/dashboard');
    }
});

// POST request
// Edit a specific note
router.post('/edit/:id', isLoggedIn, async (req, res) => {
    // Validate the body of the request and, if there are errors, send the error message
    const validation = noteValidation.validate(req.body);
    if (validation.error) {
        req.flash('error', validation.error.details[0].message);
        return res.redirect('back');
    }
    
    // Start session and transaction
    const session = await User.startSession();
    session.startTransaction();

    try {
        // Check if there is already a note (created by the current user) with the same title. 
        // If there is one, and its id is not the same as the note being edited, do not allow the user to edit the note with that title.
        const noteTitle = await Note.find({ 'author.id': req.user._id, title: req.body.title, _id: { '$ne': req.params.id } }, { 'title': 1, '_id': 1 })
            .then((note) => { return note; })
            .catch((err) => { if (err) throw err; });

        // Select category name based on the category chosen in the select field
        let categoryName;

        if (req.body.category !== '' && req.body.category !== null) {
            categoryName = await Category.find({ _id: req.body.category })
                .then((category) => { return category[0]; })
                .catch((err) => { if (err) throw err; });
        } else {
            categoryName = await Note.find({ _id: req.params.id })
                .then((note) => { return note[0].category; })
                .catch((err) => { if (err) throw err; });
        }

        if (noteTitle.length !== 0) {
            req.flash('error', 'Sorry, try a different title.');
            res.redirect('back');
        } else {
            // Find a note with a specific id and update based on the data from the form
            Note.findOneAndUpdate({ _id: req.params.id }, {
                $set: {
                    title: req.body.title,
                    body: req.body.body,
                    category: {
                        id: categoryName.id,
                        name: categoryName.name
                    }
                }
            }, 
            { new: true }, // Return the newly updated version of the document
            (err, note) => {
                if (err) { console.log(err); }
            });

            req.flash('success', 'Your note has been edited.');
            res.redirect('back');
        }

        // If everything goes well, commit the transaction and end the session
        await session.commitTransaction();
        session.endSession();
        return true;
    } catch(err) {
        // If something goes wrong, abort the transactions, end the session and throw the error
        await session.abortTransactions();
        session.endSession();
        throw err;
    }
});

// POST request
// Delete a specific note
router.post('/delete/:id', isLoggedIn, async (req, res) => {
    try {
        Note.findByIdAndRemove({ _id: req.params.id }, (err) => {
            if (err) { console.log(err); }
                console.log('Document removed!');
            });

            req.flash('success', 'Your note has been deleted.');
            res.redirect('/dashboard');
    } catch(err) {
        req.flash('error', 'Your note could not be deleted. Try again.');
        res.redirect('/dashboard');
    }
});

// POST request
// Share a specific note
router.post('/share-note/:id', isLoggedIn, async (req, res) => {
    // If more than one email was written, split the array and iterate over it to get the emails separately
    // If there is just one, userEmail = req.body.emails
    const inputBody = req.body.emails;
    let inputBodyArray;
    let userEmail;
    let userEmails = [];
    let invitedUsers = [];

    // If inputBody is an array and contains spaces, remove them and split the array
    // Otherwise, just split the array
    if (inputBody.includes(' ') === true) {
        const inputBodyNoSpaces = inputBody.replace(/\s/g, '');
        inputBodyArray = inputBodyNoSpaces.split(',');
    } else {
        inputBodyArray = inputBody.split(',');
    }

    try {
        // If more than one email was sent, loop through the original array and push the emails to the userEmails array
        // Otherwise just push the email to the userEmails array
        if (inputBodyArray.length > 0) {
            inputBodyArray.forEach((i) => {
                userEmail = i;
                userEmails.push(userEmail);
            });
        } else {
            userEmail = req.body.emails;
            userEmails.push(userEmail);
        }
    
        // Loop through the userEmails array and find users with the emails specified
        for (const mail of userEmails) {
            await User.find({ email: mail })
                .then((users) => {
                    for (user of users) {
                        invitedUsers.push(user);
                    }
                })
                .catch((err) => { if (err) throw err; });
        }
    } catch(err) {
        console.log(err);
    }

    // Find a note with a specific id and update based on the data from the share-note form
    Note.findOneAndUpdate({ _id: req.params.id }, {
            $addToSet: {
                participants: invitedUsers
            }
        }, 
        { new: true }, // Return the newly updated version of the document
        (err, note) => { 
            if (err) { 
                req.flash('error', 'An error occurred. Try again.');
            }
        }
    );

    req.flash('success', 'Invitations sent!');
    res.redirect('back');
});

module.exports = router;
