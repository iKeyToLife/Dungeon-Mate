const Quest = require('../../models/Quest');
const User = require('../../models/User');

// seed function to create quests
const seedQuests = async () => {
    try {
        // get all users
        const users = await User.find();

        for (let user of users) {
            // generate two quests for each user
            const quest1 = new Quest({
                userId: user._id,
                title: `${user.username}'s First Quest`,
                details: 'This is the first generated quest for the user.',
                rewards: '100 gold coins',
            });

            const quest2 = new Quest({
                userId: user._id,
                title: `${user.username}'s Second Quest`,
                details: 'This is the second generated quest for the user.',
                rewards: 'Mystic sword',
            });

            // save quests
            await quest1.save();
            await quest2.save();
            console.log(`Created 2 quests for user: ${user.username}`);
        }
    } catch (error) {
        console.error('Error seeding quests:', error);
    }
};

module.exports = seedQuests;