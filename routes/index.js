const express = require("express");
const router = express.Router();
const passport = require("passport");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// GET request 
// Render the index page
router.get('/', (req, res) => {
    res.render('index');
});

// GET request 
// Render the register page
router.get('/register', (req, res) => {
    res.render('register');
});

// POST request 
// Register a new user to the '/register' route
// Use 'express-validator' for validation purposes (check each field)
// If there is an error, send a 400 status and a message to the user
// If there are no errors, check if the user already exists, save the values entered in the register form by the user, encrypt the password and return a token
router.post('/register', [
    // The firstName field must not be empty
    check('firstName', 'First name is required.').not().isEmpty(),

    // The lastName field must not be empty
    check('lastName', 'Last name is required.').not().isEmpty(),

    // The email field must not be empty
    check('email', 'Email is required.').not().isEmpty(),

    // The email must be valid
    check('email', 'Please, enter a valid email.').isEmail(),

    // The password field must not be empty
    check('password', 'Password is required.').not().isEmpty(),

    // The password must be at least 5 characters
    check('password', 'Your password must be at least 5 characters.').isLength({ min: 5 }),

    // The confirmPassword field must not be empty
    check('confirmPassword', 'You must confirm your password.').not().isEmpty(),

    // confirmPassword must be equal to password
    check('confirmPassword', 'The passwords do not match.').custom((value, { req }) => value === req.body.password)
], (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    } 

    const {
        firstName,
        lastName,
        email,
        password
    } = req.body;

    // Check if the user already exists
    User.findOne({ email: email })
        .then(user => {
            if (user) {
                // errors.array() returns an array of objects. The message can be extracted from "msg"
                // In order to display all the errors in the same way in the UI, a message for this specific error is defined manually
                return res.status(400).json({ errors: [ { msg: 'This email has already been used.' } ] });
            }
        
            // Create a new user
            const newUser = new User({
                firstName,
                lastName,
                email,
                password
            });
        
            // Encrypt the password
            // First create the salt, then the hash
            // The hash will be saved as the user's password in the database
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) {
                        return res.status(400).json({ errors: [ { msg: err } ] });;
                    }
                    newUser.password = hash;
                    newUser.save()
                    .then(user => {
                        req.flash('success', 'You are now registered!');
                        res.redirect('/dashboard');
                    })
                    .catch(err => console.log(err));
                });
            });
        });
});

// GET request 
// Render the login page
router.get('/login', (req, res) => {
    res.render('login');
});

// POST request
// Login 
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

module.exports = router;