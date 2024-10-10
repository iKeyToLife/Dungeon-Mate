const Character = require('../../models/Character');
const User = require('../../models/User');

// fetch data and return json from api
const fetchData = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch from ${url}: ${response.statusText}`);
    }
    return await response.json();
};

const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];
const getRandomAttribute = () => Math.floor(Math.random() * 20) + 1;
const getRandomValue = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomGender = () => Math.random() < 0.5 ? 'Male' : 'Female';

const proficiencyList = ['Acrobatics', 'Animal Handling', 'Arcana', 'Athletics', 'Deception', 'History', 'Insight', 'Intimidation', 'Investigation', 'Medicine', 'Nature', 'Perception', 'Performance', 'Persuasion', 'Religion', 'Sleight of Hand', 'Stealth', 'Survival'];

const getCharacterImagePath = (race, characterClass, gender) => {
    // formatted to lowerCase
    const formattedRaceFolder = race.toLowerCase();
    const formattedRaceImage = race === 'Dragonborn' ? 'DB' : race;
    const formattedClass = characterClass.toLowerCase();
    const formattedGender = gender.toLowerCase();

    // create path image
    return `images/${formattedRaceFolder}/${formattedClass}/${formattedGender}/${gender}${formattedRaceImage.replace('-', '')}${characterClass}.png`;
};

const getRandomProficiencies = (count = 5) => {
    const shuffled = proficiencyList.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count); 
};


const seedCharacters = async () => {
    try {
        // get races
        const races = await fetchData('https://www.dnd5eapi.co/api/races');
        // get classes
        const classes = await fetchData('https://www.dnd5eapi.co/api/classes');
        // get spells
        const spells = await fetchData('https://www.dnd5eapi.co/api/spells');
        // get all users
        const users = await User.find();

        for (let user of users) {
            // generate random character for each user seed
            const randomRace = getRandomElement(races.results).name;
            const randomClass = getRandomElement(classes.results).name;
            const randomGender = getRandomGender();
            const imageCharacter = getCharacterImagePath(randomRace, randomClass, randomGender);
            const randomSpell = getRandomElement(spells.results);
            const randomProficiencies = getRandomProficiencies();

            const character = new Character({
                userId: user._id,
                name: `${user.username}'s Character`,
                race: randomRace, // random race
                class: [{
                    className: randomClass, // random class
                }],

                level: 1,
                gender: randomGender, // random gender
                characterImg: imageCharacter,
                attributes: {
                    strength: getRandomAttribute(),
                    dexterity: getRandomAttribute(),
                    constitution: getRandomAttribute(),
                    intelligence: getRandomAttribute(),
                    wisdom: getRandomAttribute(),
                    charisma: getRandomAttribute(),
                    hitPoints: getRandomValue(10, 20),  
                    armorClass: getRandomValue(10, 18), 
                    attackPower: getRandomValue(5, 15), 
                    magicPower: getRandomValue(3, 12),
                },
                spells: [randomSpell],
                inventory: [],
                alignment: "Lawful Good",
                proficiencies: randomProficiencies,
            });

            await character.save();
            console.log('Created character for user:', user.username);
        }
    } catch (error) {
        console.error('Error seeding characters:', error);
    }
};

module.exports = seedCharacters;
