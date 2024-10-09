import { useState } from 'react';
import { useQuery } from '@apollo/client';
import CharacterModal from '../components/CharacterModal';
import UpdateCharacterModal from '../components/UpdateCharacterModal';
import CharacterCard from '../components/CharacterCard';
import { Button } from 'reactstrap';
import { GET_CHARACTERS_BY_USER_ID } from '../utils/queries';

const Characters = ({ user = { _id: null } }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  const toggleModal = () => setModalOpen(!modalOpen);
  const toggleEditModal = () => setEditModalOpen(!editModalOpen);

  const handleEdit = (character) => {
    setSelectedCharacter(character);  // Set the character to be edited
    setEditModalOpen(true);           // Open the edit modal
  };

  const { loading, error, data } = useQuery(GET_CHARACTERS_BY_USER_ID);

  return (
    <div>
      <h1>Your Characters</h1>
      <div className="characters-container">
        <Button className="create-character-button" color="primary" onClick={toggleModal}>
          Create New Character
        </Button>
      </div>

      <CharacterModal isOpen={modalOpen} toggle={toggleModal} />

      {loading && <p>Loading characters...</p>}
      {error && <p>Error loading characters: {error.message}</p>}
      {data && data.characters && data.characters.length > 0 ? (
        <div className="characters-card-holder">
          <div className="character-card-container">
            {data.characters.map((character) => (
              <CharacterCard 
                key={character._id} 
                character={character} 
                onEdit={() => handleEdit(character)} 
              />
            ))}
          </div>
        </div>
      ) : (
        !loading && <p>No characters found for this user.</p>
      )}

      {/* Pass the selected character and open state to EditCharacterModal */}
      <UpdateCharacterModal 
        isOpen={editModalOpen} 
        toggle={toggleEditModal} 
        character={selectedCharacter} 
      />
    </div>
  );
};

export default Characters;
