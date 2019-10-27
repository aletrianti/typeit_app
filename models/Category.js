const mongoose = require('mongoose');

// Create a Category schema using mongoose
// This schema is going to define the 'category' collection in the database
// The 'category' collection includes 2 attributes, which contain 2 records each
const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        firstName: { type: String },
        lastName: { type: String },
    }
});

// Export the schema so that it can be accessible through the Category variable as a JavaScript model ('category')
module.exports = Category = mongoose.model('category', CategorySchema);
