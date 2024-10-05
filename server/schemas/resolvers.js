const { User, Character, Dungeon, Encounter } = require("../models");
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
          const user = await User.findOne({ _id: userId }); // find by userId

          if (!user) {
            throw new Error("User not found"); // if not found, throw error
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
          throw new Error(`Failed to get character: ${error.message}`);
        }
      } else {
        throw AuthenticationError;
      }
    },
    encounters: async (_, args, context) => {
      if (context.user) {
        try {
          const userId = context.user._id;
          const encounters = await Encounter.find({ userId });

          if (!encounters) {
            throw new Error("Encounters not found");
          }

          return encounters; // return all encounters
        } catch (err) {
          throw new Error(`Failed getEncounters: ${err.message}`)
        }
      } else {
        throw AuthenticationError;
      }
    },
    encounter: async (_, { encounterId }, context) => {
      if (context.user) {
        try {
          const userId = context.user._id;
          const encounter = await Encounter.findOne({ _id: encounterId, userId: userId });
          if (!encounter) {
            throw new Error("Encounter not found or you do not have access rights to this encounter");
          }
          return encounter; // return encounter
        } catch (err) {
          throw new Error(`Failed getEncounter: ${err.message}`)
        }
      } else {
        throw AuthenticationError;
      }
    },
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
    signUp: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user }
    },
    updateUser: async (parent, args, context) => {
      if (context.user) {
        try {

          return await User.findByIdAndUpdate(context.user._id, args, { new: true });

        } catch (error) {
          throw new Error(`Failed to update user: ${error.message}`);
        }
      }
      throw AuthenticationError;
    },
    deleteUser: async (parent, args, context) => {
      if (context.user) {
        try {
          const user = await User.findByIdAndDelete(context.user._id);

          if (!user) {
            throw new Error(`User not found`);
          }

          return user
        } catch (error) {
          throw new Error(`Failed to delete user: ${error.message}`);
        }
      } else {
        throw AuthenticationError
      }
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
          throw new Error(`Failed to update the character: ${error.message}`);
        }
      } else {
        throw AuthenticationError;
      }
    },
    addEncounter: async (_, args, context) => {
      if (context.user) {
        try {
          args.userId = context.user._id
          const newEncounter = new Encounter(args);

          await newEncounter.save(); // Save the encounter to the database

          return newEncounter; // Return the newly created encounter
        } catch (error) {
          throw new Error("Failed to create encounter: " + error.message);
        }
      }
      throw AuthenticationError("Please login to save encounters.");
    },
    updateEncounter: async (_, args, context) => {
      if (context.user) {
        try {
          const encounter = await Encounter.findOne({ _id: args.encounterId, userId: context.user._id });

          if (!encounter) {
            throw new Error("Encounter not found or you are not authorized to update this encounter.");
          }
          Object.assign(encounter, args);

          await encounter.save();
          return encounter;
        } catch (error) {
          throw new Error(`Failed to update the encounter: ${error.message}`);
        }
      } else {
        throw AuthenticationError;
      }
    },
    deleteEncounter: async (_, { encounterId }, context) => {
      if (context.user) {
        try {
          const userId = context.user._id
          const encounter = await Encounter.findOne({ _id: encounterId, userId: userId });

          if (!encounter) {
            throw new Error("Encounter not found or you don't have permission to delete it.");
          }

          await Encounter.deleteOne({ _id: encounterId });

          return encounter;
        } catch (error) {
          throw new Error("Failed to delete encounter: " + error.message);
        }
      }

      throw AuthenticationError;

    }
  },
};

module.exports = resolvers;
