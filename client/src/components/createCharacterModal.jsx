import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const CharacterModal = ({ isOpen, toggle }) => {
  return (
    <div>
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader>Add a Character</ModalHeader>
        <ModalBody>
          Add character Here
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            Close
          </Button>
          <Button color="primary" onClick={() => alert('Action')}>
            Submit
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default CharacterModal;