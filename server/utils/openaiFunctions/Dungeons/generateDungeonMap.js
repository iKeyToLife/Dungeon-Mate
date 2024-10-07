const OpenAI = require('openai'); // Import OpenAI SDK
const Dungeon = require('../../../models/Dungeon');

// Initialize OpenAI with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate an ASCII dungeon map with custom options based on the args we pass in
async function generateDungeonMap(dungeonId, {
  theme = 'ancient ruins',  // The overall vibe of the dungeon, like 'ruins' or 'caves'
  mapWidth = 5,             // The number of rooms across the dungeon (width)
  mapHeight = 5,            // The number of rooms down the dungeon (height)
  roomTypes = {             // These are room types with frequency settings (0 is rare, 10 is frequent)
    traps: 3,               // Traps show up with this default frequency
    enemies: 5,             // Enemies should appear with medium frequency
    treasure: 2,            // Treasure is a bit rarer
    corridors: 10           // Corridors are frequent
  },
  symmetry = false,         // Whether the map should mirror itself. False for organic/random layouts.
  multipleFloors = false,   // Adds extra floors if true
  difficulty = 'medium'     // Overall difficulty level: Easy, Medium, Hard
}) {
  try {
    const dungeon = await Dungeon.findById(dungeonId);
    if (!dungeon) {
      throw new Error('Dungeon not found');
    }

    // Modify prompt to generate separate floors if multipleFloors is true
    const floorPrompt = multipleFloors 
      ? `Generate an ASCII dungeon with 2 floors in ${theme}. Each floor should have dimensions ${mapWidth}x${mapHeight}.
          Floor 1 should have a staircase leading to Floor 2. The dungeon should include:
          - Traps (frequency: ${roomTypes.traps}),
          - Enemies (frequency: ${roomTypes.enemies}),
          - Treasure (frequency: ${roomTypes.treasure}),
          - Corridors (frequency: ${roomTypes.corridors}).
          The layout should be ${symmetry ? 'symmetrical' : 'asymmetrical'}.
          Difficulty is ${difficulty}.`
      : `Generate an ASCII dungeon with 1 floor in ${theme}, with dimensions ${mapWidth}x${mapHeight}. 
          The dungeon should include:
          - Traps (frequency: ${roomTypes.traps}),
          - Enemies (frequency: ${roomTypes.enemies}),
          - Treasure (frequency: ${roomTypes.treasure}),
          - Corridors (frequency: ${roomTypes.corridors}).
          The layout should be ${symmetry ? 'symmetrical' : 'asymmetrical'}.
          Difficulty is ${difficulty}.`;

    // Ask OpenAI to create the dungeon map based on the prompt
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",  // GPT-3.5 for good balance between speed and creativity
      messages: [{ role: "user", content: floorPrompt }],
      max_tokens: 500,         // Allocate enough tokens for detailed maps
      temperature: 1,          // Max randomness for more unique layouts
    });

    const dungeonMap = response.choices[0].message.content.trim();  // Grabbing and cleaning the response
    console.log(dungeonMap); // Print map to console for review

    // Save the generated map to the dungeon
    dungeon.description = (dungeon.description || '') + '\n\nDungeon Map:\n' + dungeonMap;
    await dungeon.save();

    return dungeonMap;  // Return the map for use elsewhere
  } catch (error) {
    console.error('Error generating dungeon map:', error);  // Log any errors
    throw error;  // Pass the error if something breaks
  }
}

module.exports = generateDungeonMap;
