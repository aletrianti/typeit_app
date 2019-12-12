const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const flash = require('connect-flash');
const passport = require("passport");
const session = require("express-session");
const sessionSecret = require("./config/config").sessionSecret;
const User = require("./models/User");

// View engine setup
app.set('views', path.join(__dirname, 'client/views'));
// Set ejs as the template engine, so that each page can be rendered correctly
app.set('view engine', 'ejs');
// Set the "client" folder as the static folder
app.use(express.static('client'));

// This is used to parse request bodies
app.use(express.urlencoded({ extended: true }));
// This is used to send json-based requests
app.use(express.json({ extended: false }));

// Passport Config
require('./config/passport')(passport);

// Require secret keys
const db = require('./config/dbKeys').mongoURI;

// Use connect-flash to display messages
app.use(flash());

// Connect to DB
mongoose
    // Connects to the database with the key specified in config/dbKeys.js
    .connect(db, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true, 
        useCreateIndex: true,
        useFindAndModify: false
    })
    // Connects and shows "Connected to db" in the console
    .then(() => console.log('Connected to db'))
    // If there is an error, it gets displayed in the console
    .catch(err => console.log(err));

// Initialize sessions with some options, including a secret key
app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    expires: new Date(Date.now() + 3600000)
}));

// Passport configuration
// Initialize passport
app.use(passport.initialize());
// Initialize passport session
app.use(passport.session());

// Local variables
app.use((req, res, next) => {
    res.locals.loggedInUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

// Require routes
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const noteRoutes = require('./routes/note');
const categoryRoutes = require('./routes/category');
const calendarRoutes = require('./routes/calendar');

// Use required routes
app.use('/', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/dashboard/notes', noteRoutes);
app.use('/dashboard/categories', categoryRoutes);
app.use('/calendar', calendarRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
    // Set the "build" folder as the static folder to use in production
    app.use(express.static('client/build'));

    // Set "index.ejs" as the index page in production
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index'));
    });
}

// Start the server on a specific port OR on port 3000 and show a message in the console
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
