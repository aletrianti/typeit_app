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
    res.render('index');
});

// GET request 
// Render the register page
router.get('/register', (req, res) => {
    res.render('register');
});

// POST request 
// Register a new user to the '/register' route
router.post('/register', async (req, res, next) => {
    // Validate the body of the request and, if there are errors, send a 400 status with the error message
    const validation = registerValidation.validate(req.body);
    if (validation.error) return res.status(400).send({ error: validation.error.details[0].message });

    // Check if the email already exists and, if it does, send a 400 status with an error message
    const registeredEmail = await User.findOne({ email: req.body.email })
    if (registeredEmail) return res.status(400).send({ error: 'Email already registered' });

    // Encrypt the password
    // First create the salt, then the hash with the password and the salt as parameters
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);

    // Create a new user
    // If there are no errors: save the user into the database and redirect them to '/login'
    try {
        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hash
        });

        newUser.save();

        res.redirect('/login');
    } catch(err) {
        // If there are errors: send a 400 status along with an error
        res.status(400).send(err);
        res.render('register');
    }
});

// GET request 
// Render the login page
router.get('/login', (req, res) => {
    res.render('login');
});

// POST request
// Login with passport for authentication with local strategy
// If the authentication is successful: redirect to the dashboard
// If something goes wrong, redirect to the login page
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login'
    })(req, res, next);
});

// GET request
// Logout functionality
// Use the logout method that comes with Express on the request
// Redirect to the login page
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

module.exports = router;