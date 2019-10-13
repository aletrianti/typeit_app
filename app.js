const express = require('express');
const app = express();
const mongoose = require('mongoose');
// const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
// const bodyParser = require('body-parser');
const path = require('path');
const User = require("./models/User");
const passportSecret = require("./config/config").passportSecret;

// This is used to parse request bodies
app.use(express.urlencoded({ extended: true }));
// Init Middleware
app.use(express.json({ extended: false }));

// Passport Config
require('./config/passport')(passport);

// Require secret keys
const db = require('./config/dbKeys').mongoURI;

// Connect to DB
mongoose
    // Connects to the database with the key specified in config/dbKeys.js
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    // Connects and shows "Connected to db" in the console
    .then(() => console.log('Connected to db'))
    // If there is an error, it gets displayed in the console
    .catch(err => console.log(err));

// Passport config
app.use(session({
    secret: passportSecret,
    resave: false,
    saveUninitialized: false
}));
// Initialize a session with passport
app.use(passport.initialize());
app.use(passport.session());

// View engine setup
app.set('views', path.join(__dirname, 'client/views'));
// Recognise every page rendered as an ejs page
app.set("view engine", "ejs");
// Set the "client" folder as the static folder
app.use(express.static('client'));

// Require routes
const authRoutes = require('./routes/index');
const dashboardRoutes = require('./routes/dashboard');

// Use required routes
app.use('/', authRoutes);
app.use('/dashboard', dashboardRoutes);

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
