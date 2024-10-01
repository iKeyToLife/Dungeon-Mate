const { User, Character, Dungeon } = require('../models');

const resolvers = {
  Query: {
    users: async () => {
      const users = await User.find();

      return users;
    },
    characters: async (parent, args) => {
      const userCharacters = await Character.find({ userId: args.userId });

      return userCharacters;
    }
  },
  // Mutation: {}
};

module.exports = resolvers;
