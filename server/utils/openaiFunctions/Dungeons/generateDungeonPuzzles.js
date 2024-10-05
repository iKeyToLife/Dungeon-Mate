const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,  
});

const openai = new OpenAIApi(configuration);

// Validate the parameters to make sure everything is as expected and nothing gets out of hand
function validateParams({ theme, difficulty, puzzleCount, failureConsequence, reward }) {
  const validDifficulties = ['easy', 'medium', 'hard'];  // These are the allowed difficulty levels
  const validConsequences = ['trap', 'damage', 'curse'];  // These are the possible failure consequences
  const validRewards = ['treasure', 'magic item', 'rare magical item', 'magical scroll'];  // Valid rewards for solving puzzles

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

// Main function, here we generate dungeon puzzles based on parameters like theme, difficulty, etc, etc.
async function generateDungeonPuzzles({
  theme = 'ancient ruins',      // Dungeon theme - default is 'ancient ruins'
  difficulty = 'medium',        // Difficulty level - default is 'medium'
  puzzleCount = 3,              // Number of puzzles to generate - default is 3
  failureConsequence = 'trap',  // What happens if players fail the puzzle, time to be Jigsaw from Saw lol.
  hintAvailability = true,      // Whether or not hints are available to players
  reward = 'treasure'           // What are we giving for solving the puzzle
}) {
  // Validate the params before running the request, just to be safe
  validateParams({ theme, difficulty, puzzleCount, failureConsequence, reward });

  // Calculate the max tokens dynamically based on the number of puzzles requested
  const maxTokens = Math.min(puzzleCount * 75, 400);  // Adjust based on puzzle count, but cap at 400 tokens

  // Build the prompt for the API based on the inputs we have
  const prompt = `Generate ${puzzleCount} ${difficulty} puzzles for a dungeon in ${theme}. 
  Each puzzle should have ${hintAvailability ? 'hints available' : 'no hints'}, 
  a failure consequence of ${failureConsequence}, and offer ${reward} as a reward.`;

  try {
    // Make the call to OpenAI, giving it the prompt and options
    const response = await openai.createCompletion({
      model: "gpt-3.5-turbo",    // Use GPT-3.5-turbo for balance between speed and creativity
      prompt: prompt,            // Pass the prompt we just built
      max_tokens: maxTokens,     // Adjust token usage for efficiency
      temperature: 0.7,          // Slight randomness for creative output
    });

    // Extract the text from the response and clean it up
    const puzzles = response.data.choices[0].text.trim();
    console.log(puzzles);  // Log to the console for checking
    return puzzles;        // Return the puzzles for further use
  } catch (error) {
    // Catch any errors during the OpenAI API call
    console.error('Error generating dungeon puzzles:', error);
    throw error;  // Re-throw in case we need to catch it higher up
  }
}

// This is just the default Example call: you can change these params when calling to generate whatever puzzle you would like.

generateDungeonPuzzles({
  theme: 'magical forest',        // Set the theme for the dungeon
  difficulty: 'hard',             // Set the difficulty level
  puzzleCount: 5,                 // Set how many puzzles you want
  failureConsequence: 'damage',   // What happens if players fail the puzzle
  hintAvailability: false,        // Turn hints on or off
  reward: 'rare magical item'     // Set the reward for solving the puzzle
});
