const OpenAI = require('openai'); // Import OpenAI SDK
const Dungeon = require('../../../models/Dungeon');
const Encounter = require('../../../models/Encounter');

// Initialize OpenAI with your API key
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Validate parameters to ensure inputs are within expected ranges and formats
function validateParams({ theme, difficulty, puzzleCount, failureConsequence, reward }) {
  const validDifficulties = ['easy', 'medium', 'hard'];  // Allowed difficulty levels
  const validConsequences = ['trap', 'damage', 'curse']; // Possible failure consequences
  const validRewards = ['treasure', 'magic item', 'rare magical item', 'magical scroll']; // Rewards for solving puzzles

  if (!validDifficulties.includes(difficulty.toLowerCase())) {
    throw new Error('Invalid difficulty level. Use: easy, medium, or hard.');
  }

  if (!validConsequences.includes(failureConsequence.toLowerCase())) {
    throw new Error('Invalid failure consequence. Use: trap, damage, or curse.');
  }

  if (!validRewards.includes(reward.toLowerCase())) {
    throw new Error('Invalid reward. Use: treasure, magic item, rare magical item, or magical scroll.');
  }

  if (puzzleCount < 1 || puzzleCount > 10) {
    throw new Error('Puzzle count should be between 1 and 10.');
  }
}

// Main function to generate dungeon puzzles based on parameters like theme, difficulty, etc.
async function generateDungeonPuzzles(dungeonId, {
  theme = 'ancient ruins',      // Dungeon theme - default is 'ancient ruins'
  difficulty = 'medium',        // Difficulty level - default is 'medium'
  puzzleCount = 3,              // Number of puzzles to generate - default is 3
  failureConsequence = 'trap',  // What happens if players fail the puzzle
  hintAvailability = true,      // Whether or not hints are available to players
  reward = 'treasure'           // Reward for solving the puzzle
}) {
  try {
    const dungeon = await Dungeon.findById(dungeonId);
    if (!dungeon) {
      throw new Error('Dungeon not found');
    }

    // Validate the parameters before making the request
    validateParams({ theme, difficulty, puzzleCount, failureConsequence, reward });

    // Calculate the max tokens dynamically based on the number of puzzles requested
    const maxTokens = Math.min(puzzleCount * 75, 400);  // Adjust based on puzzle count, but cap at 400 tokens

    // Build the prompt based on input parameters
    const prompt = `Generate ${puzzleCount} ${difficulty} puzzles for a dungeon in ${theme}. 
    Each puzzle should have ${hintAvailability ? 'hints available' : 'no hints'}, 
    a failure consequence of ${failureConsequence}, and offer ${reward} as a reward.`;

    // Send the prompt to OpenAI and generate the puzzles
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",   // Use GPT-3.5-turbo for a balance between creativity and speed
      messages: [{ role: "user", content: prompt }],
      max_tokens: maxTokens,    // Limit token usage for efficiency
      temperature: 0.7,         // A little randomness for creative output
    });

    // Extract the generated puzzles and clean up the text
    const puzzles = response.choices[0].message.content.trim();
    console.log(puzzles);  // Log the result for debugging

    // Create a new encounter for the puzzles in the database
    const newEncounter = new Encounter({
      userId: dungeon.userId,
      title: `Puzzle Encounter in ${dungeon.title}`,
      details: puzzles
    });

    await newEncounter.save();

    // Add the new encounter to the dungeon
    dungeon.encounters.push(newEncounter._id);
    await dungeon.save();

    return puzzles;  // Return the generated puzzles for further use
  } catch (error) {
    console.error('Error generating dungeon puzzles:', error);  // Log any errors
    throw error;  // Re-throw the error for further handling
  }
}

module.exports = generateDungeonPuzzles;