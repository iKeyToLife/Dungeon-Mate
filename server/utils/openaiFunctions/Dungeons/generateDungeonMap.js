const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,  
});

const openai = new OpenAIApi(configuration);

// Generate an ASCII dungeon map with custom options based on the args we pass in
async function generateDungeonMap({
  theme = 'ancient ruins',  // The overall vibe of the dungeon, like 'ruins' or 'caves'
  mapWidth = 5,             // The number of rooms across the dungeon (width)
  mapHeight = 5,            // The number of rooms down the dungeon (height)
  roomTypes = {             // These are room types with frequency settings (0 is rare, 10 is frequent)
    traps: 3,               // Traps will show up with this default frequency
    enemies: 5,             // Enemies should appear with default of medium frequency here
    treasure: 2,            // Treasure will be a bit rarer etc
    corridors: 10           // Corridors or empty rooms are maxed out
  },
  symmetry = false,         // Whether the map should mirror itself. False makes it more random and organic.
  multipleFloors = false,   // This option adds extra floors if true
  difficulty = 'medium'     // Set the overall difficulty level: Easy, Medium, Hard
}) {
  // Modify the prompt to generate separate floors if multipleFloors is true
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

  try {
    // Now we're asking OpenAI to create a dungeon map based on the prompt we built
    const response = await openai.createCompletion({
      model: "gpt-3.5-turbo",   // Using GPT-3.5-turbo here for a good balance of creativity and speed
      prompt: floorPrompt,      // Feeding it the adjusted prompt for multiple floors
      max_tokens: 500,          // Allowing for more tokens to handle multiple floors
      temperature: 1,           // Max creativity here to get more unique dungeon layouts
    });

    const dungeonMap = response.data.choices[0].text.trim();  // Grabbing and cleaning up the response
    console.log(dungeonMap); // This will print the map to the console so you can check it out
    return dungeonMap;  // Send the map back so it can be used elsewhere
  } catch (error) {
    console.error('Error generating dungeon map:', error);  // Log the error if something goes wrong
    throw error;  // Pass the error along if something breaks
  }
}

// Example call, you can customize these args to generate different dungeon maps
generateDungeonMap({
  theme: 'underground caverns', // Set this to be dungeon theme you like
  mapWidth: 8,                  // Width of the map, in rooms
  mapHeight: 8,                 // Height of the map, in rooms
  roomTypes: {
    traps: 4,                   // Adjust the frequency of traps
    enemies: 6,                 // Frequency of enemies showing up
    treasure: 3,                // Treasure frequency
    corridors: 10               // Corridors will show up often
  },
  symmetry: true,               // Makes the dungeon layout mirror itself
  multipleFloors: true,         // Set to true to generate multiple floors
  difficulty: 'hard'            // Set the difficulty of the dungeon, affects strategic placement (Easy, Medium, Hard)
});
