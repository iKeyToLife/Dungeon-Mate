const Encounter = require('../../models/Encounter');
const User = require('../../models/User');

// seed function to create encounters
const seedEncounters = async () => {
    try {
        // get all users
        const users = await User.find();

        for (let user of users) {
            // generate two encounters for each user
            const encounter1 = new Encounter({
                userId: user._id,
                title: `${user.username}'s First Encounter`,
                details: 'This is the first generated encounter for the user.',
            });

            const encounter2 = new Encounter({
                userId: user._id,
                title: `${user.username}'s Second Encounter`,
                details: 'This is the second generated encounter for the user.',
            });

            // save encounters
            await encounter1.save();
            await encounter2.save();
            console.log(`Created 2 encounters for user: ${user.username}`);
        }
    } catch (error) {
        console.error('Error seeding encounters:', error);
    }
};

module.exports = seedEncounters;
