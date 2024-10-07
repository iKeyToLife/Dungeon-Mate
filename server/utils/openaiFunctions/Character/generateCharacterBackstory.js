const OpenAI = require('openai'); // Import OpenAI SDK
const Character = require('../../../models/Character');

// Load environment variables from .env file
require('dotenv').config();

// Initialize OpenAI with API key
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Generate a character backstory, quirks, and goals based on the character form 
async function generateCharacterDetails({ race, gender, classInput, alignment }) {
    try {
      // Format class information for the prompt
      const classDescription = classInput.map(c => `${c.className}`).join(', ');
  
      // Construct the prompt to generate the character's backstory, quirks, and goals
      const prompt = `
        Create a backstory for a ${gender} ${race} ${classDescription}, aligned with ${alignment}.
        Include quirky personality traits and provide at least three main goals that fit the character's alignment and class.`;
  
      // Send the prompt to OpenAI
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 250,
        temperature: 0.7,
      });
  
      // Return the generated backstory and details
      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error generating character details:', error);
      throw error;
    }
  }  

module.exports = generateCharacterDetails;
