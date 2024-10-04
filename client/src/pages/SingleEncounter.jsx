import { useParams, useNavigate } from 'react-router-dom'; 
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import PropTypes from 'prop-types';
import { useState } from 'react';

const SingleEncounter = ({ encounters, setEncounters }) => {
  const { id } = useParams();  // Get encounter ID from the URL
  const navigate = useNavigate();  // To handle back button navigation

  // Find the encounter based on the ID
  const encounter = encounters.find((enc) => enc.id === parseInt(id));

  const [title, setTitle] = useState(encounter?.title || '');
  const [details, setDetails] = useState(encounter?.details || '');
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal open state
  const [encounterToDelete, setEncounterToDelete] = useState(null);

  const handleUpdate = () => {
    const updatedEncounters = encounters.map((enc) =>
      enc.id === parseInt(id) ? { ...enc, title, details } : enc
    );
    setEncounters(updatedEncounters);
    navigate('/encounters'); // Navigate back to the encounters list page
  };

  const handleDelete = () => {
    const updatedEncounters = encounters.filter((enc) => enc.id !== parseInt(id));
    setEncounters(updatedEncounters);
    navigate('/encounters'); // Navigate back to the encounters list page after deletion
  };

  const openDeleteModal = () => {
    setIsModalOpen(true);
    setEncounterToDelete(id);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setEncounterToDelete(null);
  };

  return (
    <div className="single-encounter-container">
      <h1>{title}</h1>
      <textarea value={details} onChange={(e) => setDetails(e.target.value)} />
      <div className="button-row">
        <button onClick={handleUpdate}>Update Encounter</button>
        <button onClick={openDeleteModal}>Delete Encounter</button>
        <button onClick={() => navigate('/encounters')}>Back</button>
      </div>

      {/* Reactstrap Modal for delete confirmation */}
      <Modal isOpen={isModalOpen} toggle={closeDeleteModal}>
        <ModalHeader toggle={closeDeleteModal}>Confirm Delete</ModalHeader>
        <ModalBody>
          Are you sure you want to delete this encounter?
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={handleDelete}>Yes, Delete</Button>
          <Button color="secondary" onClick={closeDeleteModal}>No, Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

SingleEncounter.propTypes = {
  encounters: PropTypes.array.isRequired,
  setEncounters: PropTypes.func.isRequired,
};

export default SingleEncounter;