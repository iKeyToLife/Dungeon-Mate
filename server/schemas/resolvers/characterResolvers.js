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
                args.userId = context.user._id
                const newCharacter = new Character(args);

                await newCharacter.save(); // Save the character to the database

                return newCharacter; // Return the newly created character
            } catch (error) {
                throw new Error("Failed to create character: " + error.message);
            }
        }

        throw AuthenticationError;
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
    addSpellToCharacter: async (_, { characterId, spell }, context) => {
        if (context.user) {
            const character = await Character.findOne({ _id: characterId, userId: context.user._id });
            if (!character) {
                throw new Error("Character not found or you are not authorized to update this character.");
            }
            character.spells.push(spell);
            await character.save();
            return character;
        }
        throw new AuthenticationError
    },
    removeSpellFromCharacter: async (_, { characterId, spellIndex }, context) => {
        if (context.user) {
            const character = await Character.findOne({ _id: characterId, userId: context.user._id });
            if (!character) {
                throw new Error("Character not found or you are not authorized to update this character.");
            }
            character.spells = character.spells.filter(spell => spell.index !== spellIndex);
            await character.save();
            return character;
        }
        throw new AuthenticationError
    },
    addItemToInventory: async (_, { characterId, item }, context) => {
        if (context.user) {
            const character = await Character.findOne({ _id: characterId, userId: context.user._id });
            if (!character) {
                throw new Error("Character not found or you are not authorized to update this character.");
            }
            character.inventory.push(item);
            await character.save();
            return character;
        }
        throw new AuthenticationError
    },
    removeItemFromInventory: async (_, { characterId, itemName }, context) => {
        if (context.user) {
            const character = await Character.findOne({ _id: characterId, userId: context.user._id });
            if (!character) {
                throw new Error("Character not found or you are not authorized to update this character.");
            }

            // find first itemIndex
            const itemIndex = character.inventory.findIndex(item => item.name === itemName);

            // if found then delete
            if (itemIndex > -1) {
                character.inventory.splice(itemIndex, 1); // Delete only 1 item
                await character.save();
            }

            return character;
        }
        throw new AuthenticationError;
    },
}

module.exports = {
    characterQueries,
    characterMutations,
};