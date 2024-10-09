import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import CharacterForm from './CharacterForm';
import { useMutation } from '@apollo/client';
import { UPDATE_CHARACTER } from '../utils/mutations';
import { GET_CHARACTERS_BY_USER_ID } from '../utils/queries';

const UpdateCharacterModal = ({ isOpen, toggle, character }) => {
  const [updateCharacter] = useMutation(UPDATE_CHARACTER, {
    refetchQueries: [{ query: GET_CHARACTERS_BY_USER_ID }]
  });

  const handleFormSubmit = async (formData) => {
    console.log(formData)
    try {
      const { data } = await updateCharacter({
        variables: {
          characterId: character._id,
          name: formData.name,
          race: formData.race,
          gender: formData.gender,
          class: formData.class,
          level: formData.level,
          attributes: formData.attributes,
          characterImg: formData.characterImg,
          alignment: formData.alignment,
        },
      });

      console.log('Character updated:', data.updateCharacter);
      toggle();  // Close the modal after successful submission
    } catch (error) {
      console.error('Error updating character:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader>Edit Character</ModalHeader>
      <ModalBody>
        <CharacterForm onSubmit={handleFormSubmit} character={character} />
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default UpdateCharacterModal;
