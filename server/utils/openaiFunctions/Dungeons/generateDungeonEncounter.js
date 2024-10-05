const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// Function generates dungeon encounters based on various parameters
async function generateDungeonEncounters({
  encounterType = 'normal',     // The type of encounter - normal, ambush, horde
  difficulty = 'medium',        // How tough the encounter should be - easy, medium, hard, or epic
  numberOfEnemies = 3,          // The number of enemies involved in this encounter
  enemyVariety = 2,             // Adjust variety of enemies on a scale from 1 to 5 (1 = same type, 5 = lots of types)
  enemyArchetype = ['melee'],   // What kind of enemies are there? Options: melee, ranged, magic, support
  bossEnemy = false,            // Boolean flag for whether this encounter features a boss enemy
  bossCount = 1                 // How many bosses? Only matters if bossEnemy is true
}) {
  // Make sure enemy variety stays in the range of 1 to 5. Anything higher (or lower obviously) tends to mess things up.
  if (enemyVariety < 1 || enemyVariety > 5) {
    throw new Error('enemyVariety must be between 1 and 5');  // Throwing an error if the input is wrong
  }

  // Validation check the difficulty level
  const validDifficulties = ['easy', 'medium', 'hard', 'epic'];  // These are the only difficulty levels allowed
  if (!validDifficulties.includes(difficulty)) {
    throw new Error('Invalid difficulty level. Choose from: easy, medium, hard, epic.');  // Throw an error if difficulty is wrong
  }

  // If it's a boss encounter, we need to ensure the number of bosses is within range
  if (bossEnemy && (bossCount < 1 || bossCount > 3)) {
    throw new Error('Boss count must be between 1 and 3');  // We limit the boss count to keep things balanced
  }

  // Construct the prompt for the OpenAI API, pulling in all the variables we need for the encounter
  const prompt = `
    Generate a ${difficulty} dungeon encounter.
    The encounter is a ${encounterType} with ${numberOfEnemies} enemies.
    The enemies include ${enemyVariety} types such as ${enemyArchetype.join(', ')}.
    ${bossEnemy ? `This encounter features ${bossCount} boss enemies.` : ''}
    Provide a detailed description of the enemies and the overall encounter.
  `;

  try {
    // Send our prompt to OpenAI and generate the encounter based on the given parameters
    const response = await openai.createCompletion({
      model: "gpt-3.5-turbo",  // We're using the GPT-3.5 model for a balance of creativity and speed (and it's cheap)
      prompt: prompt,          // Feeding in the prompt we just built
      max_tokens: 1500,         // Upped the token count on this to ensure enough space for detailed encounters
      temperature: 0.7,        // Keeping the randomness balanced to give creative but reliable outputs
    });

    // Grab the text response from OpenAI, trim it, and return it
    const encounterDescription = response.data.choices[0].text.trim();  
    console.log(encounterDescription);  // Log the result to the console for debugging
    return encounterDescription;  // Return the encounter description for further use
  } catch (error) {
    // If somethings' wrong log the error so we can see what happened
    console.error('Error generating dungeon encounter:', error);
    throw error;  // Re-throw in case we need to catch it higher up 
  }
}

// Example call with default args
generateDungeonEncounters({
  encounterType: 'ambush',       // Set the type of encounter (normal, ambush, horde)
  difficulty: 'hard',            // Difficulty level for the encounter
  numberOfEnemies: 5,            // Number of enemies in the encounter
  enemyVariety: 3,               // More variety in the types of enemies
  enemyArchetype: ['melee', 'ranged', 'magic'],  // A mix of different enemy types
  bossEnemy: true,               // True because we want a boss fight
  bossCount: 2                   // Two bosses, because why not?
});