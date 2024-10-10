import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { GET_CHARACTERS_BY_USER_ID } from '../utils/queries';
import { ADD_CHARACTER, UPDATE_CHARACTER, DELETE_CHARACTER } from '../utils/mutations';

// Helper function to fetch spells and inventory from DnD API
const fetchDnDData = async (url) => {
  const response = await fetch(url);
  return await response.json();
};

// Helper function to add a random variance of ±2 to a base stat
const applyVariance = (baseStat) => {
  const variance = Math.floor(Math.random() * 5) - 2; // Random number between -2 and +2
  return baseStat + variance;
};

const Characters = ({ user = { _id: null } }) => {
  const [formData, setFormData] = useState({
    name: '',
    race: '',
    gender: '',
    class: '',
    alignment: '',
    level: 1,
    bio: '',
    attributes: {
      strength: 8,
      dexterity: 8,
      constitution: 8,
      intelligence: 8,
      wisdom: 8,
      charisma: 8,
      hitPoints: 0,     
      armorClass: 0,    
      attackPower: 0,   
      magicPower: 0,    
    },
    characterImg: '',
    spells: [],
    inventory: [],
    addProficiencies: 'no',
    proficiencies: []
  });

  const [confirmedBio, setConfirmedBio] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [characterToDelete, setCharacterToDelete] = useState(null);
  const [availableProficiencies] = useState(['Acrobatics', 'Animal Handling', 'Arcana', 'Athletics', 'Deception', 'History', 'Insight', 'Intimidation', 'Investigation', 'Medicine', 'Nature', 'Perception', 'Performance', 'Persuasion', 'Religion', 'Sleight of Hand', 'Stealth', 'Survival']);
  const [selectedProficiencies, setSelectedProficiencies] = useState([]);
  const [proficienciesConfirmed, setProficienciesConfirmed] = useState(false);
  const [characterList, setCharacterList] = useState([]);
  const [deleteCharacter] = useMutation(DELETE_CHARACTER);
  const [addCharacter] = useMutation(ADD_CHARACTER);
  const [updateCharacter] = useMutation(UPDATE_CHARACTER);
  const { loading, error, data } = useQuery(GET_CHARACTERS_BY_USER_ID);
  const [availableSpells, setAvailableSpells] = useState([]);
  const [availableInventory, setAvailableInventory] = useState([]);
  const [raceData, setRaceData] = useState(null);
  const [classData, setClassData] = useState(null);
  const [reRollCount, setReRollCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch characters on component mount
  useEffect(() => {
    if (data && data.characters) {
      setCharacterList(data.characters);
    }
  }, [data]);

  useEffect(() => {
    if (formData.class) {
      fetchDnDData(`https://www.dnd5eapi.co/api/classes/${formData.class.toLowerCase()}`)
        .then(data => setClassData(data));
    }
    if (formData.race) {
      fetchDnDData(`https://www.dnd5eapi.co/api/races/${formData.race.toLowerCase()}`)
        .then(data => setRaceData(data));
    }
  }, [formData.class, formData.race]);

  // Fetch spells and inventory when the form mounts
  useEffect(() => {
    // Fetch the spells and inventory data from the DnD API
    fetchDnDData('https://www.dnd5eapi.co/api/spells').then((data) => setAvailableSpells(data.results));
    fetchDnDData('https://www.dnd5eapi.co/api/equipment').then((data) => setAvailableInventory(data.results));
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      let updatedData = { ...prevData, [name]: value };
      let raceFolder = updatedData.race.toLowerCase();
      let raceImage = updatedData.race;
      if (updatedData.race === 'Dragonborn') {
        raceFolder = 'dragonborn';
        raceImage = 'DB';
      }
      if (updatedData.race === 'Half-Orc' || updatedData.race === 'Half-Elf') {
        raceFolder = updatedData.race.toLowerCase();
        raceImage = updatedData.race.replace('-', '');
      }
      if (raceFolder && updatedData.gender) {
        const genderFolder = updatedData.gender.toLowerCase();
        updatedData.characterImg = `/images/default/${raceFolder}/${genderFolder}/${updatedData.gender}${raceImage}Default.png`;
        if (updatedData.class) {
          const selectedClassFolder = updatedData.class.toLowerCase();
          const capitalizedClass = updatedData.class.charAt(0).toUpperCase() + updatedData.class.slice(1);
          updatedData.characterImg = `/images/${raceFolder}/${selectedClassFolder}/${genderFolder}/${updatedData.gender}${raceImage}${capitalizedClass}.png`;
        }
      }
      return updatedData;
    });
  };

  // Handle Bio confirmation
  const confirmBio = () => {
    setConfirmedBio(formData.bio); // Save the bio to the confirmedBio state
  };

  const handleSpellSelect = async (e) => {
    const selectedSpell = availableSpells.find((spell) => spell.name === e.target.value);
    if (selectedSpell && formData.spells.length < 2) {
      // Fetch spell details from the API using the spell index
      const spellDetails = await fetchDnDData(`https://www.dnd5eapi.co${selectedSpell.url}`);
      setFormData((prevData) => ({
        ...prevData,
        spells: [...prevData.spells, spellDetails],
      }));
    }
  };

  const handleInventorySelect = async (e) => {
    const selectedItem = availableInventory.find((item) => item.name === e.target.value);

    if (selectedItem && formData.inventory.length < 3) {
      try {
        // Fetch item details from the API using the item index
        const itemDetails = await fetchDnDData(`https://www.dnd5eapi.co${selectedItem.url}`);

        console.log('Item details from API:', itemDetails);

        // Ensure type and description exist, or add default values
        const itemType = itemDetails.equipment_category?.name || "miscellaneous";
        const itemDescription = (itemDetails.desc && itemDetails.desc.length > 0)
          ? itemDetails.desc.join(" ")  // Join description array into a single string
          : "No description available"; // Default if no description exists

        // Update the formData with fetched details
        setFormData((prevData) => ({
          ...prevData,
          inventory: [...prevData.inventory, {
            name: selectedItem.name,
            type: itemType,
            description: itemDescription,
          }],
        }));
      } catch (error) {
        console.error('Error fetching item details:', error);
      }
    }
  };

  // Stat calculation with random variance
  const calculateStats = async () => {
    if (reRollCount >= 3) {
      setErrorMessage("You may only re-roll your stats 2 times");
      return;
    }

    const { strength, dexterity, constitution, intelligence, wisdom, charisma } = formData.attributes;

    // Fetch race and class details from D&D API
    const raceData = await fetchDnDData(`https://www.dnd5eapi.co/api/races/${formData.race.toLowerCase()}`);
    const classData = await fetchDnDData(`https://www.dnd5eapi.co/api/classes/${formData.class.toLowerCase()}`);

    // Apply race and class modifiers with variance
    let updatedStrength = applyVariance(strength);
    let updatedDexterity = applyVariance(dexterity);
    let updatedConstitution = applyVariance(constitution);
    let updatedIntelligence = applyVariance(intelligence);
    let updatedWisdom = applyVariance(wisdom);
    let updatedCharisma = applyVariance(charisma);

    raceData.ability_bonuses.forEach((bonus) => {
      switch (bonus.ability_score.index) {
        case 'str':
          updatedStrength += bonus.bonus;
          break;
        case 'dex':
          updatedDexterity += bonus.bonus;
          break;
        case 'con':
          updatedConstitution += bonus.bonus;
          break;
        case 'int':
          updatedIntelligence += bonus.bonus;
          break;
        case 'wis':
          updatedWisdom += bonus.bonus;
          break;
        case 'cha':
          updatedCharisma += bonus.bonus;
          break;
        default:
          break;
      }
    });

    // Calculate hit points and armor class with variance
    const hitDie = parseInt(classData.hit_die);
    const hitPoints = applyVariance(hitDie + Math.floor((updatedConstitution - 10) / 2));
    const armorClass = 10 + Math.floor((updatedDexterity - 10) / 2);

    // Calculate attack power and magic power
    const attackPower = Math.floor(updatedStrength * 1.5);
    const magicPower = Math.floor((updatedIntelligence * 1.2) + (updatedWisdom * 1.1));

    // Update formData with the new randomized stats, but within `attributes`
    setFormData((prevData) => ({
      ...prevData,
      attributes: {
        ...prevData.attributes,  
        strength: updatedStrength,
        dexterity: updatedDexterity,
        constitution: updatedConstitution,
        intelligence: updatedIntelligence,
        wisdom: updatedWisdom,
        charisma: updatedCharisma,
        hitPoints,    
        armorClass,   
        attackPower,  
        magicPower,   
      },
    }));

    // Increment the re-roll count
    setReRollCount(reRollCount + 1);
  };

  // Helper function to map inventory types to valid enum values
  const mapInventoryType = (type) => {
    switch (type.toLowerCase()) {
      case 'weapon':
        return 'weapon';
      case 'armor':
        return 'armor';
      case 'potion':
        return 'potion';
      case 'tool':
        return 'tool';
      case 'magic item':
        return 'magicItem';
      default:
        return 'miscellaneous';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the data to be saved
    const characterData = {
      name: formData.name,
      race: formData.race,
      gender: formData.gender,
      class: [{ className: formData.class, level: formData.level }],
      level: formData.level,
      attributes: {
        strength: formData.attributes.strength,
        dexterity: formData.attributes.dexterity,
        constitution: formData.attributes.constitution,
        intelligence: formData.attributes.intelligence,
        wisdom: formData.attributes.wisdom,
        charisma: formData.attributes.charisma,
        hitPoints: formData.attributes.hitPoints || 0,
        armorClass: formData.attributes.armorClass || 0,
        attackPower: formData.attributes.attackPower || 0,
        magicPower: formData.attributes.magicPower || 0,
      },
      spells: formData.spells.map((spell) => ({ index: spell.index, name: spell.name })),
      inventory: formData.inventory.map((item) => ({
        name: item.name,
        type: mapInventoryType(item.type),
        description: item.description || 'No description available',
      })),
      characterImg: formData.characterImg,
      alignment: formData.alignment,
    };

    try {
      if (selectedCharacter) {
        // If editing an existing character
        await updateCharacter({
          variables: {
            characterId: selectedCharacter._id,
            ...characterData,
          },
          refetchQueries: [{ query: GET_CHARACTERS_BY_USER_ID }],
        });
      } else {
        // If creating a new character
        await addCharacter({
          variables: characterData,
          refetchQueries: [{ query: GET_CHARACTERS_BY_USER_ID }],
        });
      }

      // Reset form and hide the form after save
      setShowForm(false);

      // Reset formData
      setFormData({
        name: '',
        race: '',
        gender: '',
        class: '',
        alignment: '',
        level: 1,
        bio: '',
        attributes: {
          strength: 8,
          dexterity: 8,
          constitution: 8,
          intelligence: 8,
          wisdom: 8,
          charisma: 8,
          hitPoints: 0,
          armorClass: 0,
          attackPower: 0,
          magicPower: 0,
        },
        characterImg: '',
        spells: [],
        inventory: [],
        addProficiencies: 'no',
        proficiencies: []
      });

    } catch (error) {
      console.error('Error saving character:', error);
    }
  };

  const handleEdit = (character) => {
    setSelectedCharacter(character);

    setFormData({
      name: character.name || '',
      race: character.race || '',
      gender: character.gender || '',
      class: character.class[0]?.className || '',
      alignment: character.alignment || '',
      level: character.level || 1,
      bio: character.bio || '',
      attributes: {
        strength: character.attributes?.strength || 8,
        dexterity: character.attributes?.dexterity || 8,
        constitution: character.attributes?.constitution || 8,
        intelligence: character.attributes?.intelligence || 8,
        wisdom: character.attributes?.wisdom || 8,
        charisma: character.attributes?.charisma || 8,
        hitPoints: character.attributes?.hitPoints || 0,
        armorClass: character.attributes?.armorClass || 0,
        attackPower: character.attributes?.attackPower || 0,
        magicPower: character.attributes?.magicPower || 0,
      },
      characterImg: character.characterImg || '',
      spells: character.spells || [],
      inventory: character.inventory || [],
      proficiencies: character.proficiencies || [],
      addProficiencies: character.proficiencies?.length > 0 ? 'yes' : 'no',
    });

    setShowForm(true);

    // Scroll to the form after editing starts
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Show modal for deleting a character
  const handleDeleteClick = (characterId) => {
    setCharacterToDelete(characterId);
    setShowDeleteModal(true); // Show the modal
  };

  const confirmDelete = async () => {
    try {
      await deleteCharacter({
        variables: { characterId: characterToDelete },
        refetchQueries: [{ query: GET_CHARACTERS_BY_USER_ID }], // Refetch query after delete
      });
      setShowDeleteModal(false); // Close the modal after deletion
      setCharacterToDelete(null); // Clear the state for the next deletion
    } catch (error) {
      console.error('Error deleting character:', error);
    }
  };

  const handleSpellRemove = (index) => {
    setFormData((prevData) => {
      const newSpells = [...prevData.spells];
      newSpells.splice(index, 1);
      return { ...prevData, spells: newSpells };
    });
  };

  const handleInventoryRemove = (index) => {
    setFormData((prevData) => {
      const newInventory = [...prevData.inventory];
      newInventory.splice(index, 1);
      return { ...prevData, inventory: newInventory };
    });
  };

  const handleProficiencySelect = (e) => {
    const { value } = e.target;
    setFormData((prevData) => {
      const selectedProficiencies = prevData.proficiencies;
      if (selectedProficiencies.includes(value)) {
        // Remove proficiency if already selected
        return {
          ...prevData,
          proficiencies: selectedProficiencies.filter((prof) => prof !== value),
        };
      } else if (selectedProficiencies.length < 5) {
        // Add proficiency if less than 5 are selected
        return {
          ...prevData,
          proficiencies: [...selectedProficiencies, value],
        };
      }
      // Otherwise, do nothing (limit reached)
      return prevData;
    });
  };

  const confirmProficiencies = () => {
    if (formData.proficiencies.length > 0) {
      setProficienciesConfirmed(true); // Set confirmation status to true
    }
  };

  return (
    <div className="characters-page-container">
      <div className="create-character-button-container">
        <Button className="create-character-button" onClick={() => { setShowForm(true); setSelectedCharacter(null); }}>
          Create a Character
        </Button>
      </div>

      {/* Character Form - Hidden initially */}
      {showForm && (
        <form onSubmit={handleSubmit} className="character-form-container">
          {/* Form Fields */}
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              maxLength="23"
            />
          </div>
          <div>
            <label>Race:</label>
            <select name="race" value={formData.race} onChange={handleChange}>
              <option value="">Select Race...</option>
              <option value="Dragonborn">Dragonborn</option>
              <option value="Dwarf">Dwarf</option>
              <option value="Elf">Elf</option>
              <option value="Gnome">Gnome</option>
              <option value="Half-Elf">Half-Elf</option>
              <option value="Half-Orc">Half-Orc</option>
              <option value="Halfling">Halfling</option>
              <option value="Human">Human</option>
              <option value="Tiefling">Tiefling</option>
            </select>
          </div>
          <div>
            <label>Gender:</label>
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="">Select Gender...</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div>
            <label>Class:</label>
            <select name="class" value={formData.class} onChange={handleChange}>
              <option value="">Select Class...</option>
              <option value="Barbarian">Barbarian</option>
              <option value="Bard">Bard</option>
              <option value="Cleric">Cleric</option>
              <option value="Druid">Druid</option>
              <option value="Fighter">Fighter</option>
              <option value="Monk">Monk</option>
              <option value="Paladin">Paladin</option>
              <option value="Ranger">Ranger</option>
              <option value="Rogue">Rogue</option>
              <option value="Sorcerer">Sorcerer</option>
              <option value="Warlock">Warlock</option>
              <option value="Wizard">Wizard</option>
            </select>
          </div>

          {/* Character Image Preview */}
          {formData.characterImg && (
            <div className="image-preview-container">
              <div className="character-image-preview">
                <img src={formData.characterImg} alt="Character" style={{ width: '150px' }} />
              </div>
            </div>
          )}
          <div>
            <label>Alignment:</label>
            <select name="alignment" value={formData.alignment} onChange={handleChange} required>
              <option value="">Select Alignment...</option>
              <option value="Lawful Good">Lawful Good</option>
              <option value="Neutral Good">Neutral Good</option>
              <option value="Chaotic Good">Chaotic Good</option>
              <option value="Lawful Neutral">Lawful Neutral</option>
              <option value="True Neutral">True Neutral</option>
              <option value="Chaotic Neutral">Chaotic Neutral</option>
              <option value="Lawful Evil">Lawful Evil</option>
              <option value="Neutral Evil">Neutral Evil</option>
              <option value="Chaotic Evil">Chaotic Evil</option>
            </select>
          </div>

          {/* Conditional rendering of level */}
          <div>
            <label>Level:</label>
            {selectedCharacter ? (
              <select name="level" value={formData.level} onChange={handleChange}>
                {Array.from({ length: 20 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            ) : (
              <input type="text" name="level" value={1} disabled /> // Lock level to 1 when creating a new character
            )}
          </div>

          {/* Bio Section */}
          <div>
            <label>Bio:</label>
            <textarea name="bio" value={formData.bio} onChange={handleChange} />
          </div>

          {/* Confirm Bio Button */}
          <Button type="button" className="confirm-bio-button" onClick={confirmBio}>
            Confirm Bio
          </Button>

          {/* Bio Box - Display confirmed bio */}
          {confirmedBio && (
            <div className="bio-box">
              <h4>Character Bio:</h4>
              <p>{confirmedBio}</p>
            </div>
          )}

          {/* Spell Selection */}
          <div>
            <label>Spells, Select up to Two:</label>
            <select name="spells" onChange={handleSpellSelect} disabled={formData.spells.length >= 2}>
              <option value="">Select Spell...</option>
              {availableSpells.map((spell) => (
                <option key={spell.index} value={spell.name}>
                  {spell.name}
                </option>
              ))}
            </select>
          </div>

          {/* Spells Box - Show selected spells with detailed descriptions */}
          <div className="spells-box">
            <h4>Selected Spells:</h4>
            {formData.spells.map((spell, index) => (
              <div key={index}>
                <h5>{spell.name}</h5>
                <p>{spell.desc ? spell.desc.join(" ") : "No description available"}</p>
                <Button className="remove-button-inv-spell" onClick={() => handleSpellRemove(index)}>Remove</Button>
              </div>
            ))}
          </div>

          {/* Inventory Selection */}
          <div>
            <label>Inventory, Select up to Three:</label>
            <select name="inventory" onChange={handleInventorySelect} disabled={formData.inventory.length >= 3}>
              <option value="">Select Item...</option>
              {availableInventory.map((item) => (
                <option key={item.index} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {/* Inventory Box - Show selected inventory items with detailed descriptions */}
          <div className="inventory-box">
            <h4>Selected Inventory:</h4>
            {formData.inventory.map((item, index) => (
              <div key={index}>
                <h5>{item.name}</h5>
                <p>{item.description && item.description !== 'No description available' ? item.description : "No description available"}</p>
                <Button className="remove-button-inv-spell" onClick={() => handleInventoryRemove(index)}>Remove</Button>
              </div>
            ))}
          </div>
          <Button onClick={calculateStats} disabled={reRollCount >= 3}>
            {reRollCount === 0 ? "Calculate Stats" : reRollCount >= 3 ? "No more re rolls" : "Re Roll?"}
          </Button>
          {errorMessage && (
            <p className="error-message">{errorMessage}</p>
          )}

          <div>
            <h3>Stats:</h3>
            <p>Hit Points: {formData.attributes.hitPoints}</p>
            <p>Armor Class: {formData.attributes.armorClass}</p>
            <p>Strength: {formData.attributes.strength}</p>
            <p>Dexterity: {formData.attributes.dexterity}</p>
            <p>Constitution: {formData.attributes.constitution}</p>
            <p>Intelligence: {formData.attributes.intelligence}</p>
            <p>Wisdom: {formData.attributes.wisdom}</p>
            <p>Charisma: {formData.attributes.charisma}</p>
            <p>Attack Power: {formData.attributes.attackPower}</p>
            <p>Magic Power: {formData.attributes.magicPower}</p>
          </div>

          <div>
            <label>Do you want to add proficiencies?</label>
            <select name="addProficiencies" value={formData.addProficiencies} onChange={handleChange}>
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>

          {/* Only show the proficiency selection if "Yes" is selected */}
          {formData.addProficiencies === 'yes' && !proficienciesConfirmed && (
            <div>
              <h3>Select Proficiencies (up to 5)</h3>
              <div className="proficiency-checkbox-list">
                {availableProficiencies.map((proficiency, index) => (
                  <div key={index}>
                    <input
                      type="checkbox"
                      id={proficiency}
                      name={proficiency}
                      value={proficiency}
                      onChange={handleProficiencySelect}
                      disabled={formData.proficiencies.length >= 5 && !formData.proficiencies.includes(proficiency)}
                    />
                    <label htmlFor={proficiency}>{proficiency}</label>
                  </div>
                ))}
              </div>
              <Button onClick={confirmProficiencies}>Confirm Proficiencies</Button>
            </div>
          )}

          {/* Show selected proficiencies after confirmation */}
          {proficienciesConfirmed && (
            <div className="proficiencies-container">
              <h3>Selected Proficiencies:</h3>
              <ul>
                {formData.proficiencies.map((prof, index) => (
                  <li key={index}>{prof} +1</li>
                ))}
              </ul>
            </div>
          )}
          <Button type="submit" color="primary">
            {selectedCharacter ? 'Update Character' : 'Save Character'}
          </Button>
        </form>
      )}

      {/* Character List */}
      <h1 className="existing-characters-container-h1">Your Characters</h1>
      <div className="existing-characters-container">
        {data && data.characters && data.characters.length > 0 ? (
          data.characters.map((character) => (
            <div key={character._id} className="character-card">
              <h3>{character.name}</h3>
              <img src={character.characterImg} alt={`${character.name}`} style={{ width: '100px' }} />
              <div className="character-card-buttons">
                <div className="flexbox-buttons">
                  <Button onClick={() => console.log("Navigate to SingleCharacter.jsx")}>View</Button>
                  <Button onClick={() => handleEdit(character)}>Edit</Button>
                  <Button onClick={() => handleDeleteClick(character._id)} color="danger">Delete</Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No characters found.</p>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} toggle={() => setShowDeleteModal(false)} className="parchment-modal">
        <ModalHeader>Confirm Delete</ModalHeader>
        <ModalBody>
          Are you sure you want to delete this character?
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={confirmDelete}>Yes, Delete</Button>
          <Button color="secondary" onClick={() => setShowDeleteModal(false)}>No, Cancel</Button>
        </ModalFooter>
      </Modal>
      {loading && <p>Loading characters...</p>}
      {error && <p>Error loading characters: {error.message}</p>}
    </div>
  );
};

export default Characters;