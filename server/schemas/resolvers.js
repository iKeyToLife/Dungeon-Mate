const { User, Character, Dungeon } = require("../models");
const { AuthenticationError, signToken } = require("../utils/auth");
const bcrypt = require('bcrypt');

const resolvers = {
  Query: {
    users: async () => {
      const users = await User.find();

      return users;
    },
    characters: async (parent, args, context) => {
      if (!context.user) {
        throw new AuthenticationError('You must be logged in');
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
        throw new AuthenticationError('Invalid credentials');
      }

      // compare password
      const correctPassword = await bcrypt.compare(password, user.password);
      if (!correctPassword) {
        throw new AuthenticationError('Invalid credentials');
      }

      // generate token
      const token = signToken(user);

      return { token, user };
    },
  }
};

module.exports = resolvers;
