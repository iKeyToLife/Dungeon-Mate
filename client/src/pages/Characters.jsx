import { useState, useContext } from 'react';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import CharacterModal from '../components/CharacterModal';
import CharacterCard from '../components/CharacterCard';
import { Button } from 'reactstrap'; 
import { GET_CHARACTERS_BY_USER_ID } from '../utils/queries';

const Characters = ({ user = { _id: null } }) => { 
  const [modalOpen, setModalOpen] = useState(false);
  const toggleModal = () => setModalOpen(!modalOpen);

  // Fetch characters for the current user
  const { loading, error, data } = useQuery(GET_CHARACTERS_BY_USER_ID);
    console.log(data)
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
              <div>
                  {data.characters.map((character) => (
                      <CharacterCard key={character._id} character={character} />
                  ))}
              </div>
          ) : (
              !loading && <p>No characters found for this user.</p>
          )}
      </div>
  );
};

export default Characters;