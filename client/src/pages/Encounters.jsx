import { useMutation, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import AuthService from '../utils/auth';
import { ADD_ENCOUNTER, DELETE_ENCOUNTER, UPDATE_ENCOUNTER } from '../utils/mutations';
import { GET_ENCOUNTERS } from '../utils/queries';
import { RedirectToLoginError } from '../components/Error';

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
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [updateEncounter] = useMutation(UPDATE_ENCOUNTER);
  const [deleteEncounter] = useMutation(DELETE_ENCOUNTER);

  useEffect(() => {
    if (encountersResult.data && encountersResult.data.encounters) {
      setEncounters(encountersResult.data.encounters);
    }
  }, [encountersResult]);


  // Define the addEncounter mutation
  const [addEncounter] = useMutation(ADD_ENCOUNTER, {
    onError: (error) => {
      // Catching authentication errors here
      if (error.message.includes('not authenticate')) {
        setModalMessage('Please login to save encounters.');
        setLoginModalOpen(true);  // Show modal with error message
      }
    }
  });

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
      if (error.message.includes('not authenticate')) {
        return <RedirectToLoginError message="Please login to delete encounters." />;
      }
    }
  };

  // Check if user is logged in before saving
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
      // Check if user is logged in
      const loggedIn = AuthService.loggedIn();
      if (!loggedIn) {
        return <RedirectToLoginError message="Please login to save encounters." />;
      }

      // Proceed with saving encounter if logged in and mutation is successful
      try {
        const { data } = await addEncounter({ variables: { title, details } }); // Call the mutation

        if (data) {
          const newEncounter = { id: data.addEncounter.id, title: data.addEncounter.title, details: data.addEncounter.details }; // Use returned data from mutation
          setEncounters([...encounters, newEncounter]); // Only update the state when mutation succeeds
          setTitle('');
          setDetails('');
        }
      } catch (err) {
        console.error("Encounter saving failed", err);
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
      if (error.message.includes('not authenticate')) {
        return <RedirectToLoginError message="Please login to update encounters." />;
      }
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
        <ModalHeader>Confirm Delete</ModalHeader>
        <ModalBody>
          Are you sure you want to delete this encounter?
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={handleDelete}>Yes, Delete</Button>
          <Button color="secondary" onClick={closeDeleteModal}>No, Cancel</Button>
        </ModalFooter>
      </Modal>

      {/* Modal for login requirement */}
      <Modal isOpen={loginModalOpen} toggle={() => setLoginModalOpen(false)} className="parchment-modal">
        <ModalHeader>Error</ModalHeader>
        <ModalBody>
          {modalMessage}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => setLoginModalOpen(false)}>OK</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Encounters;