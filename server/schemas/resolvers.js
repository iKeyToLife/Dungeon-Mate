const { User, Character, Dungeon } = require("../models");
const { AuthenticationError, signToken } = require("../utils/auth");
const bcrypt = require("bcrypt");

const resolvers = {
  Query: {
    users: async () => {
      const users = await User.find();
      return users;
    },
    characters: async (parent, args, context) => {
      if (!context.user) {
        throw new AuthenticationError("You must be logged in");
      }
      const userId = context.user._id;
      return Character.find({ userId });
    },
  },

  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError("Invalid credentials");
      }

      const correctPassword = await bcrypt.compare(password, user.password);
      if (!correctPassword) {
        throw new AuthenticationError("Invalid credentials");
      }

      const token = signToken(user);
      return { token, user };
    },

    addCharacter: async (_, { name, race, gender, class: classData, characterImg, level, attributes, spells, inventory, alignment }, context) => {
      if (context.user) {
        try {
          const newCharacter = new Character({
            userId: context.user._id,
            name,
            race,
            gender,
            class: classData,
            characterImg,
            level,
            attributes,
            spells,
            inventory,
            alignment,
          });

          await newCharacter.save();
          return newCharacter;
        } catch (error) {
          throw new Error("Failed to create character: " + error.message);
        }
      }
      throw new AuthenticationError("Invalid credentials");
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

      throw new AuthenticationError("You must be logged in to delete a character.");
    },
  },
};

module.exports = resolvers;