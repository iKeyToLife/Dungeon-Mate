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

      // Get all characters that belong to the logged-in user
      const userId = context.user._id;
      return Character.find({ userId });
    },
  },
  Mutation: {
    login: async (parent, { email, password }) => {
      // get user by email
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError("Invalid credentials");
      }

      // compare password
      const correctPassword = await bcrypt.compare(password, user.password);
      if (!correctPassword) {
        throw new AuthenticationError("Invalid credentials");
      }

      // generate token
      const token = signToken(user);

      return { token, user };
    },
    addCharacter: async (
      _,
      {
        name,
        race,
        gender,
        class: classData,
        characterImg,
        level,
        attributes,
        spells,
        inventory,
      },
      context
    ) => {
      if (context.user) {
        try {
          const newCharacter = new Character({
            userId: context.user._id, // assuming the user ID is stored in the context after authentication
            name,
            race,
            gender,
            class: classData,
            characterImg,
            level,
            attributes,
            spells,
            inventory,
          });

          await newCharacter.save(); // Save the character to the database

          return newCharacter; // Return the newly created character
        } catch (error) {
          throw new Error("Failed to create character: " + error.message);
        }
      }

      throw new AuthenticationError("Invalid credentials");
    },
  },
};

module.exports = resolvers;
