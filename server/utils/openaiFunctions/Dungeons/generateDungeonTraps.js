const OpenAI = require('openai'); // Import OpenAI SDK
const Dungeon = require('../../../models/Dungeon');
const Encounter = require('../../../models/Encounter');

// Setting up OpenAI with your API key from the environment
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate traps for a dungeon based on theme and difficulty
async function generateDungeonTraps(dungeonId, theme = 'ancient ruins', difficulty = 'medium', trapCount = 3) {
  try {
    const dungeon = await Dungeon.findById(dungeonId);
    if (!dungeon) {
      throw new Error('Dungeon not found');
    }

    // Keeping the prompt simple but giving enough detail to get good trap ideas
    const prompt = `Generate ${trapCount} unique traps for a dungeon in ${theme} with a ${difficulty} difficulty. Describe the traps and how they function.`;

    // Call OpenAI with parameters for trap generation
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",  // Using GPT-3.5-turbo for balance
      messages: [{ role: "user", content: prompt }],
      max_tokens: 250,         // Keeping token usage efficient
      temperature: 0.9,        // Adding randomness for creative trap ideas
    });

    // Get the generated traps, trim them, and return
    const dungeonTraps = response.choices[0].message.content.trim();
    console.log(dungeonTraps); // Outputs the result to the console for debugging

    // Create a new encounter for the traps
    const newEncounter = new Encounter({
      userId: dungeon.userId,
      title: `Trap Encounter in ${dungeon.title}`,
      details: dungeonTraps,
    });

    await newEncounter.save();

    // Add the new encounter to the dungeon
    dungeon.encounters.push(newEncounter._id);
    await dungeon.save();

    return dungeonTraps;  // Send the traps back for further use
  } catch (error) {
    console.error('Error generating dungeon traps:', error); // Log any errors
    throw error;  // Rethrow the error if needed
  }
}

module.exports = generateDungeonTraps;