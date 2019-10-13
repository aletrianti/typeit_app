const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User');

module.exports = function(passport) {
    passport.use(new LocalStrategy({ 
        usernameField: 'email',
        passReqToCallback : true 
    }, (email, password, done) => {
        // Check if the user does not exist
        User.findOne({ email })
            .then(user => {
                if (!user) {
                    return done(null, false, { msg: 'Invalid credentials' });
                }
        
                // Compare the user's encrypted password with the one inserted in the login form
                const passwordsMatch = bcrypt.compare(password, user.password);
        
                if (!passwordsMatch) {
                    return done(null, false, { msg: 'Invalid credentials' });
                }
                
                return done(null, user);
            })
            .catch(err => {
                return done(null, false, { msg: err });
            });
    }));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
}