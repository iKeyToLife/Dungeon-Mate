const OpenAI = require('openai'); // Import OpenAI SDK

// Initialize OpenAI with the API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate a shop inventory with minimal tokens used
async function generateShop({ shopType = 'random', itemCount = 5, tier = 'beginner' }) {
  // Shorter prompt to reduce token usage
  const prompt = `Create a ${tier} ${shopType} shop with ${itemCount} items. Include name and type.`;

  const response = await openai.completions.create({
    model: 'gpt-3.5-turbo',   // Using GPT-3.5-turbo model for the shop generation
    prompt: prompt,           // Passing the prompt
    max_tokens: 100,          // Keeping it concise to reduce token usage
    temperature: 0.5,         // Balanced creativity
  });

  const shopData = response.choices[0].text.trim(); // Get the result
  return shopData; // Return the generated shop data
}

module.exports = generateShop;
