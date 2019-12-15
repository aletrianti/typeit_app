// For seeding purposes

const Category = require('./models/Category');
const Note = require('./models/Note');
const User = require('./models/User');

const categories = [
    {
        name: 'Category 1',
        author: {
            id: 1,
            firstName: 'User',
            lastName: 'One'
        }
    },
    {
        name: 'Category 2',
        author: {
            id: 1,
            firstName: 'User',
            lastName: 'Two'
        }
    }
];

const notes = [
    {
        title: 'Note 1',
        body: 'My first note',
        category: {
            id: 1,
            name: 'Category 1'
        },
        author: {
            id: 1,
            firstName: 'User',
            lastName: 'One'
        },
        participants: []
    },
    {
        title: 'Note 2',
        body: 'A note',
        category: {
            id: 2,
            name: 'Category 2'
        },
        author: {
            id: 2,
            firstName: 'User',
            lastName: 'Two'
        },
        participants: []
    }
];

const users = [
    {
        username: 'user@one.com',
        firstName: 'User',
        lastName: 'One',
        email: 'user@one.com',
        password: 'test1'
    },
    {
        username: 'user@one.com',
        firstName: 'User',
        lastName: 'One',
        email: 'user@one.com',
        password: 'test1'
    }
];

const seedDB = () => {
    // Remove notes, categories and users
    Note.remove({}, (err) => {
        if (err) { console.log(err); }
        console.log('Notes removed');
    });
    Category.remove({}, (err) => {
        if (err) { console.log(err); }
        console.log('Categories removed');
    });
    User.remove({}, (err) => {
        if (err) { console.log(err); }
        console.log('Users removed');
    });

    // Seed collections
    users.forEach((usersSeed) => {
        User.create(usersSeed, (err, user) => {
            if (err) {
                console.log(err);
            }
            console.log('Created :' + user);
        });
    });
    categories.forEach((categoriesSeed) => {
        Category.create(categoriesSeed, (err, category) => {
            if (err) {
                console.log(err);
            }
            console.log('Created :' + category);
        });
    });
    notes.forEach((notesSeed) => {
        Note.create(notesSeed, (err, note) => {
            if (err) {
                console.log(err);
            }
            console.log('Created :' + note);
        });
    });
};

module.exports = seedDB;