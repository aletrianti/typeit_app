const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const registerValidation = require("../validation/authValidation").registerValidation;
const loginValidation = require("../validation/authValidation").loginValidation;
const jwtSecret = require("../config/config").jwtSecret;

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
router.post('/register', async (req, res) => {
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
    // If there are no errors, save the user into the database and redirect the user to '/login'
    // If there are errors, send the error
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
        res.status(400).send(err);
    }
});

// GET request 
// Render the login page
router.get('/login', (req, res) => {
    res.render('login');
});

// POST request
// Login 
router.post('/login', async (req, res, next) => {
    // Validate the body of the request and, if there are errors, send a 400 status with the error message
    const validation = loginValidation.validate(req.body);
    if (validation.error) return res.status(400).send({ error: validation.error.details[0].message });

    // Get user based on the email
    const user = await User.findOne({ email: req.body.email });

    // Check if the email already exists and, if it does not, send a 400 status with an error message
    if (!user) return res.status(400).send({ error: 'Invalid credentials' });

    // Check if the password is correct and, if it is not correct, send a 400 status with an error message
    const dbPassword = await bcrypt.compare(req.body.password, user.password);
    if (!dbPassword) return res.status(400).send({ error: 'Invalid credentials' });

    // Assign a token while logging in the user
    // The token is created by using the user id and a secret key
    const token = jwt.sign({_id: user._id}, jwtSecret);
    // Pass the newly created token to a header
    res.header('Authorization', token).send(token);
});

module.exports = router;