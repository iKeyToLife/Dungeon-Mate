// Import OpenAI setup and Character model
const OpenAI = require('openai');
const Character = require('../../../models/Character');

// Load environment variables from .env file
require('dotenv').config();

// Initialize OpenAI with the API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate some character names based on character info
async function generateCharacterNames({ race, gender, classInput, alignment }, numberOfNames = 5) {
  try {
    // Validate the number of names between 1-10
    if (numberOfNames < 1 || numberOfNames > 10) {
      throw new Error('Number of names must be between 1 and 10');
    }

    // Format class and level info to give to prompt
    const classDescription = classInput.map(c => `${c.className} (level ${c.level})`).join(', ');

    // Create the prompt for generating fantasy names
    const prompt = `Generate ${numberOfNames} unique fantasy names for a ${gender} ${race} ${classDescription} with ${alignment} alignment. 
                    Each name should fit the character's race and class. Provide only the names, separated by commas.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: Math.min(50 * numberOfNames, 500),
      temperature: 1.5,
    });

    // Parse and return the names
    return response.choices[0].message.content.trim().split(',').map(name => name.trim());
  } catch (error) {
    console.error('Error generating character names:', error);
    throw error;
  }
}


module.exports = generateCharacterNames;
