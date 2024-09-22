const mongoose = require('mongoose');
const User = require('../models/User');

mongoose.connect('mongodb://localhost:27017/dnd_project', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const users = [
    {
        username: 'KeyToLife',
        email: 'keytolife@example.com',
        password: 'Password123!',
        role: 'player',
        profile: {
            firstName: 'Aleksandr',
        }
    },
    {
        username: 'Burner',
        email: 'burner@example.com',
        password: 'Password123!',
        role: 'player',
        profile: {
            firstName: 'Colin',
        }
    },
    {
        username: 'ndoppler',
        email: 'doppler@example.com',
        password: 'Password123!',
        role: 'player',
        profile: {
            firstName: 'Neil',
        }
    },
    {
        username: 'KitKatKernel',
        email: 'kitkat@example.com',
        password: 'Password123!',
        role: 'player',
        profile: {
            firstName: 'James',
        }
    }
];


User.insertMany(users)
    .then(() => {
        console.log('-------------------- †USERS SEEDS† --------------------');
        mongoose.connection.close();
    })
    .catch((error) => {
        console.error('Error seeding users:', error);
        mongoose.connection.close();
    });
