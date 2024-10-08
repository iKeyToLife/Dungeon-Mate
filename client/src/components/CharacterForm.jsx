import { useState } from 'react';

const CharacterForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    race: '',
    gender: '',
    class: [],
    alignment: '', // Ensure this is set
    level: 1,
    attributes: {
      strength: 8, 
      dexterity: 8, 
      constitution: 8,
      intelligence: 8,
      wisdom: 8,
      charisma: 8,
    },
    characterImg: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };

      // Update characterImg based on current selections
      if (updatedData.race && updatedData.gender && updatedData.class.length > 0) {
        const selectedClass = updatedData.class[0].className; // Assuming single class selection
        updatedData.characterImg = `public/images/${updatedData.race}/${selectedClass}/${updatedData.gender}/${updatedData.gender}${updatedData.race}${selectedClass}.png`;
      }

      return updatedData;
    });
  };

  const handleClassChange = (e) => {
    const selectedClass = e.target.value;
    const classObject = { className: selectedClass, level: 1 };

    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        class: [classObject], // Replace with selected class (or modify for multiple classes)
      };

      // Update characterImg based on current selections
      if (updatedData.race && updatedData.gender) {
        updatedData.characterImg = `public/images/${updatedData.race}/${selectedClass}/${updatedData.gender}/${updatedData.gender}${updatedData.race}${selectedClass}.png`;
      }

      return updatedData;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if all required fields are filled
    if (!formData.name || !formData.race || !formData.gender || !formData.alignment || formData.class.length === 0) {
      alert("Please fill in all required fields.");
      return; // Prevent form submission
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
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
        <select name="className" onChange={handleClassChange}>
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

      <div>
        <label>Alignment:</label>
        <select name="alignment" value={formData.alignment} onChange={handleChange}>
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

      {/* Display the dynamically generated character image */}
      {formData.characterImg && (
        <div>
          <img src={formData.characterImg} alt="Character Preview" width="100" />
        </div>
      )}

      <button type="submit">Create Character</button>
    </form>
  );
};

export default CharacterForm;
