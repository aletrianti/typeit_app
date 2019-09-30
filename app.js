const express = require('express');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const passportLocal = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');

// Require secret keys
const db = require('./config/dbKeys').mongoURI;

// Connect to DB
mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })       // Connects to the database with the key specified in config/keys.js
    .then(() => console.log('Connected to db'))                             // Connects and shows "Connected to db" in the console
    .catch(err => console.log(err));                                        // If there is an error, it gets displayed in the console

// Start the server on a specific port OR on port 3000 and show a message in the console
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
