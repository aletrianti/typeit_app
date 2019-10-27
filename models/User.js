const mongoose = require('mongoose');
const passportMongoose = require('passport-local-mongoose');

// Create a User schema using mongoose
// This schema is going to define the 'user' collection in the database
// The 'user' collection includes 5 attributes, which contain from 2 to 3 records
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Makes it easier to authenticate users by adding methods with a plugin
// ... [TODO: Write more about this]
UserSchema.plugin(passportMongoose);

// Export the schema so that it can be accessible through the User variable as a JavaScript model ('user')
module.exports = User = mongoose.model('user', UserSchema);
