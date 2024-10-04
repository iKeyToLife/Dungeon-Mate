const connection = require('../../config/connection');
const userSeeds = require('./user-seed');
const characterSeeds = require('./character-seed');
const seedEncounters = require('./encounter-seed');

connection.on('error', (err) => err);

connection.once('open', async () => {
    try {
        console.log('-------------------- CONNECTED --------------------');

        // drop DB
        await connection.dropDatabase();
        console.log('-------------------- DROP DATABASE --------------------');

        await userSeeds();
        console.log('-------------------- USERS SEEDS --------------------');

        await characterSeeds();
        console.log('-------------------- CHARACTERS SEEDS --------------------');

        await seedEncounters();
        console.log('-------------------- ENCOUNTERS SEEDS --------------------')

        connection.close();
        console.log('-------------------- CONNECTION CLOSED --------------------');
    } catch (e) {
        console.error('Error during seeding:', err);
    }

})