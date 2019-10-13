const express = require("express");
const router = express.Router();
const passport = require("passport");
// const { check, validationResult } = require("express-validator");
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
router.post('/register', (req, res) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;
    let errors = [];

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        errors.push({ msg: 'Please enter all fields' });
    }

    if (password != confirmPassword) {
        errors.push({ msg: 'Passwords do not match' });
    }

    if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters' });
    }

    // If there are any errors, render the register page again with all the values
    if (errors.length > 0) {
        res.render('register', { errors, firstName, lastName, email, password, confirmPassword });
    } else {
        User.findOne({ email: email }).then(user => {
            if (user) {
                // If the user already exists, render the register page again with all the values
                errors.push({ msg: 'Email already exists' });
                res.render('register', { errors, firstName, lastName, email, password, confirmPassword });
            } else {
                // Create a new user
                const newUser = new User({ firstName, lastName, email, password });
          
                // Encrypt the password
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;

                        // If there are no errors, save the hashed password as the user's password
                        newUser.password = hash;
                        // Save and redirect to the login page if everything is okay
                        newUser.save()
                            .then(user => { res.redirect('/login'); })
                            .catch(err => console.log(err));
                    });
                });
            }
        });
    }
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
        failureRedirect: '/login'
    })(req, res, next);
});

module.exports = router;