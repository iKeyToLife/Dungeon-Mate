const { Quest } = require("../../models");
const { AuthenticationError } = require("../../utils/auth");


const questQueries = {
    quests: async (_, args, context) => {
        if (context.user) {
            try {
                const userId = context.user._id;
                const quests = await Quest.find({ userId });
                if (!quests) {
                    throw new Error("Quest not found");
                }

                return quests; // return all quest
            } catch (err) {
                throw new Error(`Failed getQuest: ${err.message}`)
            }
        } else {
            throw AuthenticationError;
        }
    },
    quest: async (_, { questId }, context) => {
        if (context.user) {
            try {
                const userId = context.user._id;
                const quest = await Quest.findOne({ _id: questId, userId: userId });
                if (!quest) {
                    throw new Error("Quest not found or you do not have access rights to this quest");
                }
                return quest; // return quest
            } catch (err) {
                throw new Error(`Failed getQuest: ${err.message}`)
            }
        } else {
            throw AuthenticationError;
        }
    },
}

const questMutations = {
    addQuest: async (_, args, context) => {
        if (context.user) {
            try {
                args.userId = context.user._id
                const newQuest = new Quest(args);

                await newQuest.save(); // Save the quest to the database

                return newQuest; // Return the newly created quest
            } catch (error) {
                throw new Error("Failed to create quest: " + error.message);
            }
        }
        throw AuthenticationError;
    },
    updateQuest: async (_, args, context) => {
        if (context.user) {
            try {
                const quest = await Quest.findOne({ _id: args.questId, userId: context.user._id });

                if (!quest) {
                    throw new Error("Quest not found or you are not authorized to update this quest.");
                }
                Object.assign(quest, args);

                await quest.save();
                return quest;
            } catch (error) {
                throw new Error(`Failed to update the quest: ${error.message}`);
            }
        } else {
            throw AuthenticationError;
        }
    },
    deleteQuest: async (_, { questId }, context) => {
        if (context.user) {
            try {
                const userId = context.user._id
                const quest = await Quest.findOne({ _id: questId, userId: userId });

                if (!quest) {
                    throw new Error("Quest not found or you don't have permission to delete it.");
                }

                await Quest.deleteOne({ _id: questId });

                return quest;
            } catch (error) {
                throw new Error("Failed to delete quest: " + error.message);
            }
        }

        throw AuthenticationError;

    }
}

module.exports = {
    questQueries,
    questMutations
};