const { Dungeon, Quest, Encounter } = require("../../models");
const { AuthenticationError } = require("../../utils/auth");
const { validateIds } = require("../../utils/validators");


const dungeonQueries = {
    dungeons: async (_, args, context) => {
        if (context.user) {
            try {
                const userId = context.user._id;
                const dungeons = await Dungeon.find({ userId })
                    .populate("encounters")
                    .populate("quests");
                if (!dungeons) {
                    throw new Error("Dungeon not found");
                }

                return dungeons; // return all dungeon
            } catch (err) {
                throw new Error(`Failed getdungeon: ${err.message}`)
            }
        } else {
            throw AuthenticationError;
        }
    },
    dungeon: async (_, { dungeonId }, context) => {
        if (context.user) {
            try {
                const userId = context.user._id;
                const dungeon = await Dungeon.findOne({ _id: dungeonId, userId: userId })
                    .populate("encounters")
                    .populate("quests");

                if (!dungeon) {
                    throw new Error("Dungeon not found or you do not have access rights to this dungeon");
                }
                return dungeon; // return dungeon
            } catch (err) {
                throw new Error(`Failed getdungeon: ${err.message}`)
            }
        } else {
            throw AuthenticationError;
        }
    },
}

const dungeonMutations = {
    addDungeon: async (_, args, context) => {
        if (context.user) {
            try {
                args.userId = context.user._id
                const newDungeon = new Dungeon(args);

                if (args.quests && args.quests.length > 0) {
                    const existingQuests = await Quest.find({ _id: { $in: args.quests } });
                    if (existingQuests.length !== args.quests.length) {
                        throw new Error("One or more quest IDs are invalid.");
                    }
                }

                if (args.encounters && args.encounters.length > 0) {
                    const existingEncounters = await Encounter.find({ _id: { $in: args.encounters } });
                    if (existingEncounters.length !== args.encounters.length) {
                        throw new Error("One or more encounter IDs are invalid.");
                    }
                }

                await newDungeon.save(); // Save the dungeon to the database

                return newDungeon; // Return the newly created dungeon
            } catch (error) {
                throw new Error("Failed to create dungeon: " + error.message);
            }
        }
        throw AuthenticationError;
    },
    updateDungeon: async (_, args, context) => {
        if (context.user) {
            try {
                const dungeon = await Dungeon.findOne({ _id: args.dungeonId, userId: context.user._id })
                    .populate("encounters")
                    .populate("quests");

                if (!dungeon) {
                    throw new Error("Dungeon not found or you are not authorized to update this dungeon.");
                }

                await validateIds(args.quests, Quest, 'quest'); // check have we quest at db

                await validateIds(args.encounters, Encounter, 'encounter'); // check have we encounter at db

                Object.assign(dungeon, args);

                await dungeon.save();
                return dungeon;
            } catch (error) {
                throw new Error(`Failed to update the dungeon: ${error.message}`);
            }
        } else {
            throw AuthenticationError;
        }
    },
    deleteDungeon: async (_, { dungeonId }, context) => {
        if (context.user) {
            try {
                const userId = context.user._id
                const dungeon = await Dungeon.findOne({ _id: dungeonId, userId: userId });

                if (!dungeon) {
                    throw new Error("Dungeon not found or you don't have permission to delete it.");
                }

                await Dungeon.deleteOne({ _id: dungeonId });

                return dungeon;
            } catch (error) {
                throw new Error("Failed to delete dungeon: " + error.message);
            }
        }

        throw AuthenticationError;

    },
    addEncounterToDungeon: async (_, { dungeonId, encounterId }, context) => {
        if (context.user) {
            try {
                const dungeon = await Dungeon.findOne({ _id: dungeonId, userId: context.user._id })
                    .populate("encounters")
                    .populate("quests");

                if (!dungeon) {
                    throw new Error("Dungeon not found or you are not authorized to update this dungeon.");
                }

                await validateIds([encounterId], Encounter, 'encounter'); // check have we encounter at db

                // check unique encounter
                const encounterIndex = dungeon.encounters.findIndex(encounter => encounter._id.toString() === encounterId);
                if (encounterIndex > -1) {
                    throw new Error("Encounter is already added to this dungeon.");
                }

                // add new encounter
                dungeon.encounters.push(encounterId);

                await dungeon.save();
                const updateDungeon = await Dungeon.findOne({ _id: dungeonId, userId: context.user._id })
                    .populate("encounters")
                    .populate("quests");


                return updateDungeon;
            } catch (error) {
                throw new Error(`Failed to add encounter: ${error.message}`);
            }
        } else {
            throw AuthenticationError;
        }
    },
    removeEncounterFromDungeon: async (_, { dungeonId, encounterId }, context) => {
        if (context.user) {
            try {
                const dungeon = await Dungeon.findOne({ _id: dungeonId, userId: context.user._id })
                    .populate("encounters")
                    .populate("quests");

                if (!dungeon) {
                    throw new Error("Dungeon not found or you are not authorized to update this dungeon.");
                }

                // check have we this encounter in array
                const encounterIndex = dungeon.encounters.findIndex(encounter => encounter._id.toString() === encounterId);
                if (encounterIndex === -1) {
                    throw new Error("Encounter not found in this dungeon.");
                }

                // delete encounter from array
                dungeon.encounters.splice(encounterIndex, 1);

                await dungeon.save();
                return dungeon;
            } catch (error) {
                throw new Error(`Failed to remove encounter: ${error.message}`);
            }
        } else {
            throw AuthenticationError;
        }
    }, addQuestToDungeon: async (_, { dungeonId, questId }, context) => {
        if (context.user) {
            try {
                const dungeon = await Dungeon.findOne({ _id: dungeonId, userId: context.user._id })
                    .populate("encounters")
                    .populate("quests");

                if (!dungeon) {
                    throw new Error("Dungeon not found or you are not authorized to update this dungeon.");
                }

                await validateIds([questId], Quest, 'quest'); // check have we quest at db

                // check unique quest
                const questIndex = dungeon.quests.findIndex(quest => quest._id.toString() === questId);
                if (questIndex > -1) {
                    throw new Error("Quest is already added to this dungeon.");
                }

                // add new quest
                dungeon.quests.push(questId);

                await dungeon.save();
                const updateDungeon = await Dungeon.findOne({ _id: dungeonId, userId: context.user._id })
                    .populate("encounters")
                    .populate("quests");


                return updateDungeon;
            } catch (error) {
                throw new Error(`Failed to add quest: ${error.message}`);
            }
        } else {
            throw AuthenticationError;
        }
    },
    removeQuestFromDungeon: async (_, { dungeonId, questId }, context) => {
        if (context.user) {
            try {
                const dungeon = await Dungeon.findOne({ _id: dungeonId, userId: context.user._id })
                    .populate("encounters")
                    .populate("quests");

                if (!dungeon) {
                    throw new Error("Dungeon not found or you are not authorized to update this dungeon.");
                }

                // check have we this quest in array
                const questIndex = dungeon.quests.findIndex(quest => quest._id.toString() === questId);
                if (questIndex === -1) {
                    throw new Error("Quest not found in this dungeon.");
                }

                // delete quest from array
                dungeon.quests.splice(questIndex, 1);

                await dungeon.save();
                return dungeon;
            } catch (error) {
                throw new Error(`Failed to remove quest: ${error.message}`);
            }
        } else {
            throw AuthenticationError;
        }
    },
}

module.exports = {
    dungeonQueries,
    dungeonMutations
};