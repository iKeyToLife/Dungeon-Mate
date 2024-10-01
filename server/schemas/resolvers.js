const { User, Character, Dungeon } = require('../models');

const resolvers = {
  Query: {
    users: async (parent, args, context) => {
      const users = await User.find();

      return users;
    }
  },
  characters: async (parent, args, context) => {
    const userId = context.user.id;
    
    // Fetch all characters that belong to the logged-in user
    const characters = await Character.find({ userId });

    return characters;
  },
  // Mutation: {}
};

module.exports = resolvers;
