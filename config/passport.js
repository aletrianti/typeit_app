const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User');

module.exports = function(passport) {
    // Initialize local strategy for sessions, serialize and deserialize users:
    // All this is possible thanks to methods that come from the passport-local-mongoose package
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            // Check if the user exists
            User.findOne({ email: email })
                .then(user => {
                    if (!user) {
                        return done(null, false, { error: 'Invalid credentials' });
                    }

                    // Check if the passwords match
                    bcrypt.compare(password, user.password, (err, passwordsMatch) => {
                        if (err) throw err;
                        if (passwordsMatch) {
                            return done(null, user);
                        } else {
                            return done(null, false, { error: 'Invalid credentials' });
                        }
                    });
                });
        })
    );
    
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
}