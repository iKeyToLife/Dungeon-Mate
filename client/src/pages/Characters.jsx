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
    },
    characterImg: '',
    spells: [],
    inventory: [],
    stats: {
      hitPoints: 0,
      armorClass: 0,
    },
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

  const [deleteCharacter] = useMutation(DELETE_CHARACTER);
  const [addCharacter] = useMutation(ADD_CHARACTER);
  const [updateCharacter] = useMutation(UPDATE_CHARACTER);

  const { loading, error, data } = useQuery(GET_CHARACTERS_BY_USER_ID);

  const [availableSpells, setAvailableSpells] = useState([]);
  const [availableInventory, setAvailableInventory] = useState([]);

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
      // Fetch item details from the API using the item index
      const itemDetails = await fetchDnDData(`https://www.dnd5eapi.co${selectedItem.url}`);

      setFormData((prevData) => ({
        ...prevData,
        inventory: [...prevData.inventory, itemDetails],
      }));
    }
  };

  // Stat calculation based on attributes
  const calculateStats = () => {
    const { strength, dexterity, constitution, intelligence, wisdom, charisma } = formData.attributes;

    // Example custom logic for calculation
    const hitPoints = constitution * 2 + 10;
    const armorClass = 10 + Math.floor(dexterity / 2);
    const attackPower = Math.floor(strength * 1.5);
    const magicPower = Math.floor((intelligence * 1.2) + (wisdom * 1.1));

    // Update the formData with the calculated stats
    setFormData((prevData) => ({
      ...prevData,
      stats: {
        hitPoints,
        armorClass,
        strength,
        dexterity,
        constitution,
        intelligence,
        wisdom,
        charisma,
        attackPower,
        magicPower,
      }
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedCharacter) {
      await updateCharacter({ variables: { characterId: selectedCharacter._id, ...formData } });
    } else {
      await addCharacter({ variables: { ...formData } });
    }
  };

  const handleEdit = (character) => {
    setSelectedCharacter(character);
    setFormData(character);
  };

  // Show modal for deleting a character
  const handleDeleteClick = (characterId) => {
    setCharacterToDelete(characterId);
    setShowDeleteModal(true); // Show the modal
  };

  const confirmDelete = async () => {
    await deleteCharacter({ variables: { characterId: characterToDelete } });
    setShowDeleteModal(false); // Close the modal after deletion
    setCharacterToDelete(null); // Clear the state for the next deletion
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
                <p>{item.desc ? item.desc : "No description available"}</p>
                <Button className="remove-button-inv-spell" onClick={() => handleInventoryRemove(index)}>Remove</Button>
              </div>
            ))}
          </div>

          <Button type="button" onClick={calculateStats}>
            Calculate Stats
          </Button>

          <div>
            <h3>Stats:</h3>
            <p>Hit Points: {formData.stats.hitPoints}</p>
            <p>Armor Class: {formData.stats.armorClass}</p>
            <p>Strength: {formData.stats.strength}</p>
            <p>Dexterity: {formData.stats.dexterity}</p>
            <p>Constitution: {formData.stats.constitution}</p>
            <p>Intelligence: {formData.stats.intelligence}</p>
            <p>Wisdom: {formData.stats.wisdom}</p>
            <p>Charisma: {formData.stats.charisma}</p>
            <p>Attack Power: {formData.stats.attackPower}</p>
            <p>Magic Power: {formData.stats.magicPower}</p>
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
                <Button onClick={() => console.log("Navigate to SingleCharacter.jsx")}>View</Button>
                <Button onClick={() => handleEdit(character)}>Edit</Button>
                <Button onClick={() => handleDeleteClick(character._id)} color="danger">Delete</Button>
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