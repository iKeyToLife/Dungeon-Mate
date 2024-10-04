const { Configuration, OpenAIApi } = require('openai');

// Set up OpenAI with your API key from the environment
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// Function to generate a dungeon description based on theme and difficulty
async function generateDungeonDescription(theme = 'ancient ruins', difficulty = 'medium') {
  // Keep the prompt short, but still give enough detail for a solid response
  const prompt = `Describe a ${difficulty} dungeon in ${theme}, focusing on the atmosphere, environment, and key features.`;

  try {
    // Call OpenAI with a specific model and parameters
    const response = await openai.createCompletion({
      model: "gpt-3.5-turbo",
      prompt: prompt,
      max_tokens: 250,  // Keep the token count down, cause poor.
      temperature: 0.7, // A bit of randomness for creativity
    });

    // Get the text response, clean it up, and return it
    const dungeonDescription = response.data.choices[0].text.trim();
    console.log(dungeonDescription); // console for debugging
    return dungeonDescription;  // Send the description back for use elsewhere
  } catch (error) {
    // Catch and log any errors
    console.error("Error generating dungeon description:", error);
  }
}

// Example call, you can customize the theme and difficulty here by changing args ex: (temple, hard) 
generateDungeonDescription();