const Dungeon = require('../../models/Dungeon');
const User = require('../../models/User');
const Encounter = require('../../models/Encounter');

// seed function to create dungeons
const seedDungeons = async () => {
    try {
        // get all users
        const users = await User.find();

        for (let user of users) {
            // get all encounters for the current user
            const userEncounters = await Encounter.find({ userId: user._id });

            // make sure there are encounters for this user
            if (userEncounters.length > 0) {
                // Randomly select some encounters (you can adjust the number as needed)
                const randomEncounters = userEncounters
                    .sort(() => 0.5 - Math.random()) // Shuffle encounters
                    .slice(0, 2); // Select 2 random encounters (adjust as needed)

                // create two dungeons for each user
                const dungeon1 = new Dungeon({
                    userId: user._id,
                    title: `${user.username}'s First Dungeon`,
                    description: 'This is the first generated dungeon for the user.',
                    encounters: randomEncounters.map(encounter => encounter._id), // Add random encounters
                });

                const dungeon2 = new Dungeon({
                    userId: user._id,
                    title: `${user.username}'s Second Dungeon`,
                    description: 'This is the second generated dungeon for the user.',
                    encounters: randomEncounters.map(encounter => encounter._id), // Same or different encounters
                });

                // save dungeons
                await dungeon1.save();
                await dungeon2.save();
                console.log(`Created 2 dungeons for user: ${user.username}`);
            } else {
                console.log(`No encounters found for user: ${user.username}`);
            }
        }
    } catch (error) {
        console.error('Error seeding dungeons:', error);
    }
};

module.exports = seedDungeons;