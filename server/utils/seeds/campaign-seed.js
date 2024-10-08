const Campaign = require('../../models/Campaign');
const User = require('../../models/User');
const Quest = require('../../models/Quest');
const Encounter = require('../../models/Encounter');
const Dungeon = require('../../models/Dungeon');

// seed function to create campaigns
const seedCampaigns = async () => {
    try {
        // get all users
        const users = await User.find();

        for (let user of users) {
            // get all quests, encounters, and dungeons for the current user
            const userQuests = await Quest.find({ userId: user._id });
            const userEncounters = await Encounter.find({ userId: user._id });
            const userDungeons = await Dungeon.find({ userId: user._id });

            // make sure the user has at least one quest, encounter, and dungeon
            if (userQuests.length > 0 && userEncounters.length > 0 && userDungeons.length > 0) {
                // Define creatures for the campaign
                const creatures = [
                    { index: 'creature1', name: 'Gandalf the Grey' },
                    { index: 'creature2', name: 'Legolas Greenleaf' }
                ];
                const npcs = [
                    { description: 'npc1' },
                    { description: 'npc2' }
                ];
                const notes = [
                    { description: 'note1' },
                    { description: 'note2' }
                ];

                // Randomly select some quests, encounters, and dungeons
                const randomQuests = userQuests.sort(() => 0.5 - Math.random()).slice(0, 2); // Select 2 quests
                const randomEncounters = userEncounters.sort(() => 0.5 - Math.random()).slice(0, 2); // Select 2 encounters
                const randomDungeons = userDungeons.sort(() => 0.5 - Math.random()).slice(0, 1); // Select 1 dungeon

                // create two campaigns for each user
                const campaign1 = new Campaign({
                    userId: user._id,
                    title: `${user.username}'s First Campaign`,
                    description: 'This is the first generated campaign for the user.',
                    npcs: npcs,
                    notes: notes,
                    creatures: creatures, // Add predefined creatures
                    quests: randomQuests.map(quest => quest._id), // Add random quests
                    encounters: randomEncounters.map(encounter => encounter._id), // Add random encounters
                    dungeons: randomDungeons.map(dungeon => dungeon._id), // Add random dungeon
                });

                const campaign2 = new Campaign({
                    userId: user._id,
                    title: `${user.username}'s Second Campaign`,
                    description: 'This is the second generated campaign for the user.',
                    npcs: npcs,
                    notes: notes,
                    creatures: creatures, // Add predefined creatures (or you can change them)
                    quests: randomQuests.map(quest => quest._id), // Add same or different quests
                    encounters: randomEncounters.map(encounter => encounter._id), // Add same or different encounters
                    dungeons: randomDungeons.map(dungeon => dungeon._id), // Add same or different dungeon
                });

                // save campaigns
                await campaign1.save();
                await campaign2.save();
                console.log(`Created 2 campaigns for user: ${user.username}`);
            } else {
                console.log(`Not enough quests, encounters, or dungeons for user: ${user.username}`);
            }
        }
    } catch (error) {
        console.error('Error seeding campaigns:', error);
    }
};

module.exports = seedCampaigns;