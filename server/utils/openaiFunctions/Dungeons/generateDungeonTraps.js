const { Configuration, OpenAIApi } = require('openai');

// Setting up OpenAI with your API key from the environment
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// Generate traps for a dungeon based on theme and difficulty
async function generateDungeonTraps(theme = 'ancient ruins', difficulty = 'medium', trapCount = 3) {
  // Keeping the prompt simple but giving enough detail to get good trap ideas
  const prompt = `Generate ${trapCount} unique traps for a dungeon in ${theme} with a ${difficulty} difficulty. Describe the traps and how they function.`;

  try {
    // Call OpenAI with parameters for trap generation
    const response = await openai.createCompletion({
      model: "gpt-3.5-turbo",
      prompt: prompt,
      max_tokens: 250,  // Adjust token usage to keep it efficient but descriptive
      temperature: 0.9, // A little randomness for creative trap ideas
    });

    // Get the generated traps, trim them, and return
    const dungeonTraps = response.data.choices[0].text.trim();
    console.log(dungeonTraps); // Outputs the result to console for debugging
    return dungeonTraps;  // Send the traps back for further use
  } catch (error) {
    // Log any errors if something goes wrong
    console.error('Error generating dungeon traps:', error);
    throw error; // Rethrow the error in case it's needed further up the stack
  }
}

// Example call, you can customize the theme, difficulty, and number of traps here, ex: ('underground caverns', 'hard', 5)
// Might  potentially extend this function in the future to work with ASCII maps from generateDungeonMap.js for more dynamic dungeon encounters.
generateDungeonTraps('underground caverns', 'hard', 5);
