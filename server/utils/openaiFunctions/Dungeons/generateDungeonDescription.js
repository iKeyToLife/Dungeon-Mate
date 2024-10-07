const OpenAI = require('openai');
const Dungeon = require('../../../models/Dungeon');

// Set up OpenAI with your API key from the environment
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to generate a dungeon description based on theme and difficulty
async function generateDungeonDescription(dungeonId, theme = 'ancient ruins', difficulty = 'medium') {
  // Keep the prompt short, but still give enough detail for a solid response
  const prompt = `Describe a ${difficulty} dungeon in ${theme}, focusing on the atmosphere, environment, and key features.`;

  try {
    const dungeon = await Dungeon.findById(dungeonId);
    if (!dungeon) {
      throw new Error('Dungeon not found');
    }

    // Call OpenAI with a specific model and parameters
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 750,
      temperature: 0.7,
    });
    

    // Get the text response, clean it up, and return it
    const dungeonDescription = response.data.choices[0].text.trim();
    console.log(dungeonDescription); // console for debugging
    
    dungeon.description = dungeonDescription;
    await dungeon.save();

    return dungeonDescription;  // Send the description back for use elsewhere
  } catch (error) {
    // Catch and log any errors
    console.error("Error generating dungeon description:", error);
    throw error;
  }
}

module.exports = generateDungeonDescription;