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
                // Attach the userId to the character
                args.userId = context.user._id;

                // Ensure fields like inventory, spells, and proficiencies are initialized to avoid undefined errors
                const newCharacter = new Character({
                    ...args,
                    proficiencies: args.proficiencies || [],
                    inventory: args.inventory || [],
                    spells: args.spells || [],
                    attributes: {
                        strength: args.attributes.strength || 8,
                        dexterity: args.attributes.dexterity || 8,
                        constitution: args.attributes.constitution || 8,
                        intelligence: args.attributes.intelligence || 8,
                        wisdom: args.attributes.wisdom || 8,
                        charisma: args.attributes.charisma || 8,
                        hitPoints: args.attributes.hitPoints || 0,
                        armorClass: args.attributes.armorClass || 0,
                        attackPower: args.attributes.attackPower || 0,
                        magicPower: args.attributes.magicPower || 0,
                    }
                });

                // Save the new character to the database
                await newCharacter.save();

                // Return the newly created character
                return newCharacter;
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

                // Update fields but preserve existing attributes and other nested data structures
                character.name = args.name || character.name;
                character.race = args.race || character.race;
                character.gender = args.gender || character.gender;
                character.class = args.class || character.class;
                character.level = args.level || character.level;
                character.characterImg = args.characterImg || character.characterImg;
                character.alignment = args.alignment || character.alignment;
                character.bio = args.bio || character.bio;
                character.spells = args.spells || character.spells;
                character.inventory = args.inventory || character.inventory;
                character.proficiencies = args.proficiencies || character.proficiencies;

                character.attributes.strength = args.attributes?.strength || character.attributes.strength;
                character.attributes.dexterity = args.attributes?.dexterity || character.attributes.dexterity;
                character.attributes.constitution = args.attributes?.constitution || character.attributes.constitution;
                character.attributes.intelligence = args.attributes?.intelligence || character.attributes.intelligence;
                character.attributes.wisdom = args.attributes?.wisdom || character.attributes.wisdom;
                character.attributes.charisma = args.attributes?.charisma || character.attributes.charisma;
                character.attributes.hitPoints = args.attributes?.hitPoints || character.attributes.hitPoints;
                character.attributes.armorClass = args.attributes?.armorClass || character.attributes.armorClass;
                character.attributes.attackPower = args.attributes?.attackPower || character.attributes.attackPower;
                character.attributes.magicPower = args.attributes?.magicPower || character.attributes.magicPower;

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
        throw AuthenticationError;
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
        throw AuthenticationError;
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
        throw AuthenticationError;
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
        throw AuthenticationError;
    },
}

module.exports = {
    characterQueries,
    characterMutations,
};