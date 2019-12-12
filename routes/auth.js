const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const registerValidation = require("../validation/authValidation").registerValidation;
const loginValidation = require("../validation/authValidation").loginValidation;
const User = require("../models/User");

// GET request 
// Render the index page
router.get('/', (req, res) => {
    res.redirect('/login');
});

// GET request 
// Render the register page
router.get('/register', (req, res) => {
    res.render('register', { pathname: '/register' });
});

// POST request 
// Register a new user to the '/register' route
router.post('/register', async (req, res, next) => {
    // Validate the body of the request and, if there are errors, send the error message
    const validation = registerValidation.validate(req.body);
    if (validation.error) {
        req.flash('error', validation.error.details[0].message);
        return res.redirect('/register');
    }

    // Check if the email already exists and, if it does, send an error message
    const registeredEmail = await User.findOne({ email: req.body.email });
    if (registeredEmail) {
        req.flash('error', 'Email already registered.');
        return res.redirect('/register');
    }

    // Encrypt the password
    // First create the salt, then the hash with the password and the salt as parameters
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);

    // Create a new user
    // If there are no errors: save the user into the database and redirect them to '/login'
    try {
        const newUser = new User({
            username: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hash
        });

        newUser.save();

        req.flash('success', 'You have been registered! Please log in.');
        res.redirect('/login');
    } catch(err) {
        // If there are errors: send an error
        req.flash('error', err);
        res.redirect('/register');
    }
});

// GET request 
// Render the login page
router.get('/login', (req, res) => {
    res.render('login', { pathname: '/login' });
});

// POST request
// Login with passport for authentication with local strategy
// If the authentication is successful: redirect to the dashboard
// If something goes wrong, redirect to the login page
router.post('/login', async (req, res, next) => {
    // Validate the body of the request and, if there are errors, send the error message
    const validation = loginValidation.validate(req.body);
    if (validation.error) {
        req.flash('error', validation.error.details[0].message);
        return res.redirect('/login');
    }

    // Check if the email already exists and, if it does not, send an error message
    const registeredEmail = await User.findOne({ email: req.body.email });
    if (!registeredEmail) {
        req.flash('error', 'Wrong credentials. Please, try again.');
        return res.redirect('/login');
    }

    // Check if the password corresponds to the hash saved in the database
    const hashedPassword = await User.findOne({ email: req.body.email }).then((user) => { return user.password });
    bcrypt.compare(req.body.password, hashedPassword, (err, password) => {
        if (password) {
            passport.authenticate('local', {
                successRedirect: '/dashboard',
                failureRedirect: '/login'
            })(req, res, next);
        } else {
            req.flash('error', 'Wrong credentials. Please, try again.');
            return res.redirect('/login');
        }
    });
});

// GET request
// Logout functionality
// Use the logout method that comes with Express on the request
// Redirect to the login page
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'You have been logged out! We hope to see you again soon.');
    res.redirect('/login');
});

module.exports = router;