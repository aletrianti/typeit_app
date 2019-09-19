const express = require('express');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const passportLocal = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');
const config = require('config');
const path = require('path');

// Require mongoURI key
const db = config.get('mongoURI');

// Connect to DB
mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })       // Connect to the database with the "mongoURI" key specified in config/default.json
    .then(() => console.log('Connected to db'))                             // Connect and show "Connected to db" in the console
    .catch(err => console.log(err));                                        // If there is an error, it gets displayed in the console

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
    // Set the "build" folder as the static folder to use in production
    app.use(express.static('client/build'));

    // Set "index.html" as the index page in production
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

// Start the server on a specific port OR on port 3000 and show a message in the console
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
