const generateCharacterBackstory = require('../../utils/openaiFunctions/Character/generateCharacterBackstory');
const generateCharacterNames = require('../../utils/openaiFunctions/Character/generateCharacterNames');
const generateCharacterPicture = require('../../utils/openaiFunctions/Character/generateCharacterPicture');
const generateDungeonDescription = require('../../utils/openaiFunctions/Dungeons/generateDungeonDescription');
const generateDungeonEncounter = require('../../utils/openaiFunctions/Dungeons/generateDungeonEncounter');
const generateDungeonMap = require('../../utils/openaiFunctions/Dungeons/generateDungeonMap');
const generateDungeonPuzzles = require('../../utils/openaiFunctions/Dungeons/generateDungeonPuzzles');
const generateDungeonTraps = require('../../utils/openaiFunctions/Dungeons/generateDungeonTraps');
const { AuthenticationError } = require('../../utils/auth');

const aiMutations = {
  // Mutation to generate a character's backstory.
  generateCharacterBackstory: async (_, { characterId }, context) => {
    if (context.user) {
      return generateCharacterBackstory(characterId); 
    }
    throw new AuthenticationError('You need to be logged in!'); 
  },
  
  // Mutation to generate character names. 
  generateCharacterNames: async (_, { race, gender, classInput, alignment, numberOfNames }, context) => {
    if (context.user) {
      return generateCharacterNames(race, gender, classInput, alignment, numberOfNames); // Generate names based on input fields
    }
    throw new AuthenticationError('You need to be logged in!');
  },
  
  
  // Mutation to generate a character picture. Can pass optional gritty or overwrite flags.
  generateCharacterPicture: async (_, { characterId, isGritty, overwrite }, context) => {
    if (context.user) {
      return generateCharacterPicture(characterId, isGritty, overwrite); // Calls AI to generate an image
    }
    throw new AuthenticationError('You need to be logged in!'); // If the user isn’t logged in, they can't waste tokens
  },

  // Mutation to generate a dungeon description based on theme and difficulty.
  generateDungeonDescription: async (_, { dungeonId, theme, difficulty }, context) => {
    if (context.user) {
      return generateDungeonDescription(dungeonId, theme, difficulty); 
    }
    throw new AuthenticationError('You need to be logged in!'); 
  },
  
  // Mutation to generate a dungeon encounter, including combat details.
  generateDungeonEncounter: async (_, args, context) => {
    if (context.user) {
      return generateDungeonEncounter(args.dungeonId, args); 
    }
    throw new AuthenticationError('You need to be logged in!'); 
  },
  
  // Mutation to generate a dungeon map. Args include theme, room types, and more.
  generateDungeonMap: async (_, args, context) => {
    if (context.user) {
      return generateDungeonMap(args.dungeonId, args); // Generates an ASCII dungeon map
    }
    throw new AuthenticationError('You need to be logged in!'); 
  },
  
  // Mutation to generate dungeon puzzles, based on user inputs.
  generateDungeonPuzzles: async (_, args, context) => {
    if (context.user) {
      return generateDungeonPuzzles(args.dungeonId, args); 
    }
    throw new AuthenticationError('You need to be logged in!'); 
  },
  
  // Mutation to generate traps for a dungeon. Takes trap count, theme, and difficulty.
  generateDungeonTraps: async (_, { dungeonId, theme, difficulty, trapCount }, context) => {
    if (context.user) {
      return generateDungeonTraps(dungeonId, theme, difficulty, trapCount);
    }
    throw new AuthenticationError('You need to be logged in!');
  },
};

module.exports = {
  aiMutations,
};
