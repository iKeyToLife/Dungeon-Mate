const OpenAI = require('openai'); // Import OpenAI SDK
const Encounter = require('../../../models/Encounter');
const Dungeon = require('../../../models/Dungeon');

// Set up OpenAI with API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function generates dungeon encounters based on various parameters
async function generateDungeonEncounters(dungeonId, {
  encounterType = 'normal',     // The type of encounter - normal, ambush, horde
  difficulty = 'medium',        // How tough the encounter should be - easy, medium, hard, or epic
  numberOfEnemies = 3,          // The number of enemies involved in this encounter
  enemyVariety = 2,             // Adjust variety of enemies on a scale from 1 to 5 (1 = same type, 5 = lots of types)
  enemyArchetype = ['melee'],   // What kind of enemies are there? Options: melee, ranged, magic, support
  bossEnemy = false,            // Boolean flag for whether this encounter features a boss enemy
  bossCount = 1                 // How many bosses? Only matters if bossEnemy is true
}) {
  // Make sure enemy variety stays in the range of 1 to 5. Anything higher (or lower) tends to mess things up.
  if (enemyVariety < 1 || enemyVariety > 5) {
    throw new Error('enemyVariety must be between 1 and 5');  // Error if input is wrong
  }

  // Validation check for the difficulty level
  const validDifficulties = ['easy', 'medium', 'hard', 'epic'];  // Allowed difficulty levels
  if (!validDifficulties.includes(difficulty)) {
    throw new Error('Invalid difficulty level. Choose from: easy, medium, hard, epic.');  // Throw error if difficulty is wrong
  }

  // Ensure boss count is within range if it's a boss encounter
  if (bossEnemy && (bossCount < 1 || bossCount > 3)) {
    throw new Error('Boss count must be between 1 and 3');  // Limit the boss count for balance
  }

  try {
    const dungeon = await Dungeon.findById(dungeonId);
    if (!dungeon) {
      throw new Error('Dungeon not found');
    }

    // Construct the prompt for the OpenAI API
    const prompt = `
      Generate a ${difficulty} dungeon encounter.
      The encounter is a ${encounterType} with ${numberOfEnemies} enemies.
      The enemies include ${enemyVariety} types such as ${enemyArchetype.join(', ')}.
      ${bossEnemy ? `This encounter features ${bossCount} boss enemies.` : ''}
      Provide a detailed description of the enemies and the overall encounter.
    `;

    // Call OpenAI API and generate the encounter based on parameters
    const response = await openai.completions.create({
      model: "gpt-3.5-turbo",  // Using GPT-3.5 for balance of creativity and speed
      prompt: prompt,          // Feeding in the prompt we built
      max_tokens: 1500,        // Higher token count to allow detailed encounters
      temperature: 0.7,        // Balanced randomness for creativity
    });

    // Get the text response from OpenAI and return it
    const encounterDescription = response.choices[0].text.trim();
    console.log(encounterDescription);  // Log result for debugging

    // Create a new encounter in the database
    const newEncounter = new Encounter({
      userId: dungeon.userId,
      title: `${encounterType} Encounter in ${dungeon.title}`,
      details: encounterDescription
    });

    await newEncounter.save();

    // Add the new encounter to the dungeon
    dungeon.encounters.push(newEncounter._id);
    await dungeon.save();

    return encounterDescription;  // Return the generated encounter description
  } catch (error) {
    console.error('Error generating dungeon encounter:', error); // Log errors
    throw error;  // Re-throw error for further handling
  }
}

module.exports = generateDungeonEncounters;