import { useState } from 'react';
import CharacterModal from '../components/CharacterModal';
import { Button } from 'reactstrap'; 

const Characters = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  return (
    <div>
      <h1>Your Characters</h1>
      
      <Button color="primary" onClick={toggleModal}>
        Create New Character
      </Button>

      <CharacterModal isOpen={modalOpen} toggle={toggleModal} />
    </div>
  );
};

export default Characters;