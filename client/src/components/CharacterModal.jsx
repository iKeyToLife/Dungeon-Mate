import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import CharacterForm from './CharacterForm';

const CharacterModal = ({ isOpen, toggle }) => {
  const handleFormSubmit = (formData) => {
    toggle();
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