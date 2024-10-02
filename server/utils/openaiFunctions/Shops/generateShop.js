const { Configuration, OpenAIApi } = require('openai');

// OpenAI setup with the API key from .env
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize the OpenAI API
const openai = new OpenAIApi(configuration);

// Generate a shop inventory with minimal tokens used
async function generateShop({ shopType = 'random', itemCount = 5, tier = 'beginner' }) {
  // Shorter prompt to reduce token usage
  const prompt = `Create a ${tier} ${shopType} shop with ${itemCount} items. Include name and type.`;

  const response = await openai.createCompletion({
    model: 'gpt-3.5-turbo',
    prompt: prompt,
    max_tokens: 100,         // Keeping it concise to reduce token usage
    temperature: 0.5,        // Balanced creativity
  });

  const shopData = response.data.choices[0].text.trim(); // Get the result
  return shopData;
}

module.exports = generateShop;