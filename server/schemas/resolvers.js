const { User, Character, Dungeon } = require('../models');

const resolvers = {
  Query: {
    users: async (parent, args, context) => {
      const users = await User.find();

      return users;
    }
  },
  // Mutation: {}
};

module.exports = resolvers;
