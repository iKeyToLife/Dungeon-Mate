import { useMutation, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { ADD_ENCOUNTER, DELETE_ENCOUNTER, UPDATE_ENCOUNTER } from '../utils/mutations';
import { GET_ENCOUNTERS } from '../utils/queries';

const Encounters = () => {
  const [encounters, setEncounters] = useState([]);
  const encountersResult = useQuery(GET_ENCOUNTERS);
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [titleError, setTitleError] = useState('');
  const [detailsError, setDetailsError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [encounterToDelete, setEncounterToDelete] = useState(null);
  const [createEncounter] = useMutation(ADD_ENCOUNTER);
  const [updateEncounter] = useMutation(UPDATE_ENCOUNTER);
  const [deleteEncounter] = useMutation(DELETE_ENCOUNTER);

  // Apply the received data from the server
  useEffect(() => {
    if (encountersResult.data && encountersResult.data.encounters) {
      setEncounters(encountersResult.data.encounters);
    }
  }, [encountersResult]);

  // Handle opening the delete modal
  const openDeleteModal = (index) => {
    setEncounterToDelete(index); // Set which encounter to delete
    setIsModalOpen(true); // Open modal
  };

  // Close the modal
  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setEncounterToDelete(null);
  };

  // Confirm and delete the encounter
  const handleDelete = async () => {
    try {
      // try delete
      await deleteEncounter({
        variables: { encounterId: encounters[encounterToDelete].id },
      });

      // if deleted, update encounters
      setEncounters(encounters.filter((_, index) => index !== encounterToDelete));
      closeDeleteModal(); // Close the modal after deletion

    } catch (error) {
      // Error
      alert(error.message);
    }
  };

  const handleSave = async () => {
    let valid = true;
    setTitleError('');
    setDetailsError('');

    if (title.trim() === '') {
      setTitleError('Please enter a title for your encounter');
      valid = false;
    }
    if (details.trim() === '') {
      setDetailsError('Please enter some information about your encounter');
      valid = false;
    }

    if (valid) {
      try {
        const { data } = await createEncounter({
          variables: { title, details },
        });
        const newEncounter = data.addEncounter;
        setEncounters([...encounters, newEncounter]);
        setTitle('');
        setDetails('');
      } catch (error) {
        alert(error.message)
      }
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setTitle(encounters[index].title);
    setDetails(encounters[index].details);
  };

  const handleUpdate = async () => {
    try {
      const { data } = await updateEncounter({
        variables: { encounterId: encounters[editingIndex].id, title, details },
      });

      const updatedEncounters = [...encounters];
      updatedEncounters[editingIndex] = data.updateEncounter;
      setEncounters(updatedEncounters);
      setTitle('');
      setDetails('');
      setEditingIndex(null);
    } catch (error) {
      alert(error.message)
    }
  };

  return (
    <div className="encounter-container">
      <h1 className="encounter-title">Create an Encounter</h1>
      <div className="input-section">
        <input
          type="text"
          placeholder="Title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="encounter-title-input"
        />
        {titleError && <p className="encounter-error-message">{titleError}</p>}

        <textarea
          placeholder="Details..."
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          className="encounter-input"
        />
        {detailsError && <p className="encounter-error-message">{detailsError}</p>}

        {editingIndex === null ? (
          <button className="save-encounter-button" onClick={handleSave}>
            Save Encounter
          </button>
        ) : (
          <button className="save-encounter-button" onClick={handleUpdate}>
            Update Encounter
          </button>
        )}
      </div>

      <h2 className="created-title">Existing Encounters:</h2>
      <div className="encounter-grid">
        {encounters.length === 0 ? (
          <p>No encounters created yet</p>
        ) : (
          encounters.map((encounter, index) => (
            <div className="encounter-card" key={index}>
              <h3>{encounter.title}</h3>
              <p>{encounter.details}</p>
              <div className="encounter-button-row">
                <button className="encounter-button-edit" onClick={() => handleEdit(index)}>Edit</button>
                <button className="encounter-button-delete" onClick={() => openDeleteModal(index)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reactstrap Modal for delete confirmation */}
      <Modal isOpen={isModalOpen} toggle={closeDeleteModal} className="parchment-modal">
        <ModalHeader toggle={false}>Confirm Delete</ModalHeader>
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

export default Encounters;