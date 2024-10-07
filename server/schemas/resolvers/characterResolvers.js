const { Character } = require("../../models");
const { AuthenticationError } = require("../../utils/auth");

const characterQueries = {
    characters: async (parent, args, context) => {
        if (!context.user) {
            throw AuthenticationError;
        }

        // Get all characters that belong to the logged-in user
        const userId = context.user._id;
        return Character.find({ userId });
    },
    character: async (_, { characterId }, context) => {
        if (context.user) {
            try {
                const character = await Character.findOne({ _id: characterId, userId: context.user._id });

                if (!character) {
                    throw new Error("Character not found or you do not have access rights to this character");
                }

                return character;
            } catch (error) {
                throw new Error(`Failed to get character: ${error.message}`);
            }
        } else {
            throw AuthenticationError;
        }
    },
}

const characterMutations = {
    addCharacter: async (parent, args, context) => {
        if (context.user) {
            try {
                console.log('Received args:', args); // Added this line for debugging
                args.userId = context.user._id;
                const newCharacter = new Character(args);
                await newCharacter.save();
                return newCharacter;
            } catch (error) {
                console.error('Error in addCharacter resolver:', error); // Added this line too
                throw new Error("Failed to create character: " + error.message);
            }
        }
        throw new AuthenticationError('You must be logged in to create a character');
    },
    deleteCharacter: async (_, { characterId }, context) => {
        if (context.user) {
            try {
                const character = await Character.findOne({ _id: characterId, userId: context.user._id });

                if (!character) {
                    throw new Error("Character not found or you don't have permission to delete it.");
                }

                await Character.deleteOne({ _id: characterId });

                return character;
            } catch (error) {
                throw new Error("Failed to delete character: " + error.message);
            }
        }

        throw AuthenticationError;
    },
    updateCharacter: async (_, args, context) => {
        if (context.user) {
            try {
                const character = await Character.findOne({ _id: args.characterId, userId: context.user._id });

                if (!character) {
                    throw new Error("Character not found or you are not authorized to update this character.");
                }
                Object.assign(character, args);

                await character.save();
                return character;
            } catch (error) {
                throw new Error(`Failed to update the character: ${error.message}`);
            }
        } else {
            throw AuthenticationError;
        }
    },
}

module.exports = {
    characterQueries,
    characterMutations,
};