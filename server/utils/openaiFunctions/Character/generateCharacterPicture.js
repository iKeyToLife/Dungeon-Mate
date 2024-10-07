// Import OpenAI setup and Character model
const OpenAI = require('openai');
const Character = require('../../../models/Character');

// Load environment variables from .env file
require('dotenv').config();

// Initialize OpenAI with the API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate character image based on character data, with gritty option and overwrite flag
async function generateCharacterPicture(characterId, isGritty = false, overwrite = false) {
  try {
    // Fetch character data from the database by its ID
    const character = await Character.findById(characterId);
    
    // If the character doesn’t exist, throw an error
    if (!character) {
      throw new Error('Character not found');
    }

    // If character already has an image and overwrite flag is false, return the existing image URL
    if (character.characterImg && !overwrite) {
      return character.characterImg; // No need to generate a new image
    }

    // Destructure character attributes we’ll use in the prompt
    const { race, class: characterClasses, gender, alignment, level, inventory } = character;
    
    // Format class information and pick a few items from the inventory
    const classDescription = characterClasses.map(c => `${c.className} (level ${c.level})`).join(', ');
    const featuredItems = inventory.slice(0, 3).map(item => item.name).join(', '); // Grab top 3 items

    // Selects the appropriate prompt based on whether gritty mode is enabled
    const prompt = isGritty
      ? `Generate a battle-worn ${gender} ${race} ${classDescription}, alignment ${alignment}, level ${level}. 
         They carry ${featuredItems}. The character has damaged gear, scars, and is in a gritty, dark setting.`
      : `Generate an image of a ${gender} ${race} ${classDescription}, alignment ${alignment}, level ${level}. 
         They carry ${featuredItems}. Include appropriate attire, features, and a suitable fantasy setting.`;

    // Call the OpenAI API to generate the image using DALL·E 3
    const response = await openai.images.generate({
      model: 'dall-e-3',  // Use DALL·E 3 for better quality and support
      prompt: prompt,
      size: "1024x1024",  // Image size
      quality: "standard", // Use 'standard' or 'hd' for high definition
      n: 1, // We only want one image
    });

    const imageUrl = response.data[0].url; // Get the URL of the generated image

    // Save the generated image URL to the character in the database
    character.characterImg = imageUrl;
    await character.save();

    // Return the URL of the generated image
    return imageUrl;
  } catch (error) {
    console.error('Error generating character picture:', error); // Log any errors
    throw error;
  }
}

module.exports = generateCharacterPicture;
