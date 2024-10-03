const { User, Character, Dungeon } = require("../models");
const { AuthenticationError, signToken } = require("../utils/auth");
const bcrypt = require("bcrypt");

const resolvers = {
  Query: {
    users: async () => {
      const users = await User.find();

      return users;
    },
    user: async (_, args, context) => {
      if (context.user) {
        try {
          const userId = context.user._id;
          const user = await User.findOne({ _id: userId });

          if (!user) {
            throw new Error("User not found");
          }

          return user;
        } catch (error) {
          throw new Error(`Failed to delete character: ${error.message}`);
        }
      } else {
        throw AuthenticationError;
      }
    },
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
          throw new Error(`Failed to delete character: ${error.message}`);
        }
      } else {
        throw AuthenticationError;
      }
    }
  },
  Mutation: {
    login: async (parent, { email, password }) => {
      // get user by email
      const user = await User.findOne({ email });
      if (!user) {
        throw AuthenticationError;
      }

      // compare password
      const correctPassword = await bcrypt.compare(password, user.password);
      if (!correctPassword) {
        throw AuthenticationError;
      }

      // generate token
      const token = signToken(user);

      return { token, user };
    },
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
          throw new Error(`Failed to update the character: \n${error.message}`);
        }
      } else {
        throw AuthenticationError;
      }
    }
  },
};

module.exports = resolvers;
