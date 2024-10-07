const { Dungeon } = require("../../models");
const { AuthenticationError } = require("../../utils/auth");

const dungeonQueries = {
  // Fetch all dungeons for the logged-in user
  dungeons: async (_, __, context) => {
    if (context.user) {
      return Dungeon.find({ userId: context.user._id }); // Return all dungeons tied to the current user
    }
    throw new AuthenticationError('Not logged in');
  },

  // Fetch a specific dungeon by ID, but only if it belongs to the logged-in user
  dungeon: async (_, { dungeonId }, context) => {
    if (context.user) {
      return Dungeon.findOne({ _id: dungeonId, userId: context.user._id }); // Return dungeon IF matches user's ID
    }
    throw new AuthenticationError('Not logged in');
  },
};

const dungeonMutations = {
  // Create a new dungeon and link it to the logged-in user
  addDungeon: async (_, args, context) => {
    if (context.user) {
      const dungeon = new Dungeon({ ...args, userId: context.user._id }); // Assign new dungeon to current user
      return dungeon.save();
    }
    throw new AuthenticationError('Not logged in');
  },

  // Update an existing dungeon, but only if it belongs to the logged-in user
  updateDungeon: async (_, { dungeonId, ...args }, context) => {
    if (context.user) {
      return Dungeon.findOneAndUpdate(
        { _id: dungeonId, userId: context.user._id }, // Only updates dungeons user owns
        args,
        { new: true } // Return the updated document
      );
    }
    // Throw an error if not logged in
    throw new AuthenticationError('Not logged in');
  },

  // Delete a dungeon
  deleteDungeon: async (_, { dungeonId }, context) => {
    if (context.user) {
      return Dungeon.findOneAndDelete({ _id: dungeonId, userId: context.user._id }); // Find and delete the dungeon if the user owns it
    }
    throw new AuthenticationError('Not logged in');
  },
};

module.exports = { dungeonQueries, dungeonMutations };
