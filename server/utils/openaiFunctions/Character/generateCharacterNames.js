// Import OpenAI setup and Character model
const { Configuration, OpenAIApi } = require('openai');
const Character = require('../../../models/Character');

// Grab the OpenAI API key from environment and set it up
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Generate some character names based on character info
async function generateCharacterNames(characterId, numberOfNames = 5) {
  try {
    // Make sure the number of names requested is reasonable (1 to 10)
    if (numberOfNames < 1 || numberOfNames > 10) {
      throw new Error('Number of names must be between 1 and 10');
    }

    // Pull character details from the database using the ID
    const character = await Character.findById(characterId);
    
    // If no character, throw an error to stop here
    if (!character) {
      throw new Error('Character not found');
    }

    // Extract key character details for name generation
    const { race, class: characterClasses, gender, alignment } = character;
    
    // Format class and level info for the prompt
    const classDescription = characterClasses.map(c => `${c.className} (level ${c.level})`).join(', ');

    // Set up a nice, detailed prompt to generate relevant fantasy names
    const prompt = `Generate ${numberOfNames} unique fantasy names for a ${gender} ${race} ${classDescription} with ${alignment} alignment. 
                    Each name should fit the character's race and class. Provide only the names, separated by commas.`;

    // Ask OpenAI to generate names
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: Math.min(50 * numberOfNames, 500), // Avoid too many tokens, we're poor.
      n: 1, // Number of sets of names, we just need 1.
      temperature: 1.5, // Pretty creative
    });

    // Split the response into list of names
    const generatedNames = response.data.choices[0].message.content.trim().split(',').map(name => name.trim());

    // Send the names back
    return generatedNames;
  } catch (error) {
    console.error('Error generating character names:', error);
    throw error;
  }
}

module.exports = generateCharacterNames;
