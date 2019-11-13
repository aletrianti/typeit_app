const mongoose = require('mongoose');

// Create a Note schema using mongoose
// This schema is going to define the 'note' collection in the database
// The 'note' collection includes 5 attributes, which contain from 2 to 3 records
const NoteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String
    },
    category: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category"
        },
        name: { type: String }
    },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        firstName: { type: String },
        lastName: { type: String }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Export the schema so that it can be accessible through the Note variable as a JavaScript model ('note')
module.exports = Note = mongoose.model('note', NoteSchema);
