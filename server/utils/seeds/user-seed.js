const mongoose = require('mongoose');
const User = require('../../models/User');

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


const seedUsers = async () => {
    try {
        await User.insertMany(users)
    } catch (e) {
        console.error('Error seeding users:', e);
        mongoose.connection.close();
    }
}

module.exports = seedUsers;