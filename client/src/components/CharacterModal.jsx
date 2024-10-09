import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import CharacterForm from './CharacterForm';
import { useMutation } from '@apollo/client';
import { ADD_CHARACTER } from '../utils/mutations'; // Make sure this path is correct
import { GET_CHARACTERS_BY_USER_ID } from '../utils/queries';

const CharacterModal = ({ isOpen, toggle }) => {
  const [addCharacter] = useMutation(ADD_CHARACTER, { refetchQueries: [ GET_CHARACTERS_BY_USER_ID ]}); // Reference the mutation here

  const handleFormSubmit = async (formData) => {
    try {
      const { data } = await addCharacter({
        variables: {
          name: formData.name,
          race: formData.race,
          gender: formData.gender,
          class: formData.class, // Assuming className is an array of ClassInput
          level: formData.level,
          attributes: formData.attributes, // Ensure you have this in your form data
          spells: formData.spells, // Ensure you have this in your form data
          inventory: formData.inventory, // Ensure you have this in your form data
          characterImg: formData.characterImg, // Ensure you have this in your form data
          alignment: formData.alignment,
        },
      });
  
      toggle(); // Close the modal after successful submission
    } catch (error) {
      console.error('Error adding character:', error);
    }
  };

  return (
    <div>
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader>Add a Character</ModalHeader>
        <ModalBody>
          <CharacterForm onSubmit={handleFormSubmit} />
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default CharacterModal;