import { useMutation, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import AuthService from '../utils/auth';
import { ADD_QUEST, DELETE_QUEST, UPDATE_QUEST } from '../utils/mutations';
import { GET_QUESTS } from '../utils/queries';
import { RedirectToLoginError } from '../components/Error';

const Quests = () => {
    const [quests, setQuests] = useState([]);
    const questsResult = useQuery(GET_QUESTS);
    const [title, setTitle] = useState('');
    const [details, setDetails] = useState('');
    const [rewards, setRewards] = useState(''); 
    const [editingIndex, setEditingIndex] = useState(null);
    const [titleError, setTitleError] = useState('');
    const [detailsError, setDetailsError] = useState('');
    const [rewardsError, setRewardsError] = useState(''); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [questToDelete, setQuestToDelete] = useState(null);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [updateQuest] = useMutation(UPDATE_QUEST);
    const [deleteQuest] = useMutation(DELETE_QUEST);
  
    useEffect(() => {
      if (questsResult.data && questsResult.data.quests) {
        setQuests(questsResult.data.quests);
      }
    }, [questsResult]);
  
    // Define the addQuest mutation
    const [addQuest] = useMutation(ADD_QUEST, {
      onError: (error) => {
        // Catching authentication errors here
        if (error.message.includes('not authenticate')) {
          setModalMessage('Please login to save quests.');
          setLoginModalOpen(true);  // Show modal with error message
        }
      }
    });
  
    // Handle opening the delete modal
    const openDeleteModal = (index) => {
      setQuestToDelete(index); // Set which quest to delete
      setIsModalOpen(true); // Open modal
    };
  
    // Close the modal
    const closeDeleteModal = () => {
      setIsModalOpen(false);
      setQuestToDelete(null);
    };
  
    // Confirm and delete the quest
    const handleDelete = async () => {
      try {
        // try delete
        await deleteQuest({
          variables: { questId: quests[questToDelete].id },
        });
  
        // if deleted, update quests
        setQuests(quests.filter((_, index) => index !== questToDelete));
        closeDeleteModal(); // Close the modal after deletion
  
      } catch (error) {
        // Error
        if (error.message.includes('not authenticate')) {
          return <RedirectToLoginError message="Please login to delete quests." />;
        }
      }
    };
  
    // Check if user is logged in before saving
    const handleSave = async () => {
      let valid = true;
      setTitleError('');
      setDetailsError('');
      setRewardsError(''); // Reset rewards error
  
      if (title.trim() === '') {
        setTitleError('Please enter a title for your quest');
        valid = false;
      }
      if (details.trim() === '') {
        setDetailsError('Please enter some details for your quest');
        valid = false;
      }
      if (rewards.trim() === '') {
        setRewardsError('Please enter the rewards for your quest');
        valid = false;
      }
  
      if (valid) {
        // Check if user is logged in
        const loggedIn = AuthService.loggedIn();
        if (!loggedIn) {
          return <RedirectToLoginError message="Please login to save quests." />;
        }
  
        // Proceed with saving quest if logged in and mutation is successful
        try {
          const { data } = await addQuest({ variables: { title, details, rewards } }); // Call the mutation
  
          if (data) {
            const newQuest = { id: data.addQuest.id, title: data.addQuest.title, details: data.addQuest.details, rewards: data.addQuest.rewards }; // Use returned data from mutation
            setQuests([...quests, newQuest]); // Only update the state when mutation succeeds
            setTitle('');
            setDetails('');
            setRewards(''); // Reset rewards
          }
        } catch (err) {
          console.error("Quest saving failed", err);
        }
      }
    };
  
    const handleEdit = (index) => {
      setEditingIndex(index);
      setTitle(quests[index].title);
      setDetails(quests[index].details);
      setRewards(quests[index].rewards); // Set rewards for editing
    };
  
    const handleUpdate = async () => {
      try {
        const { data } = await updateQuest({
          variables: { questId: quests[editingIndex].id, title, details, rewards },
        });
  
        const updatedQuests = [...quests];
        updatedQuests[editingIndex] = data.updateQuest;
        setQuests(updatedQuests);
        setTitle('');
        setDetails('');
        setRewards(''); // Reset rewards
        setEditingIndex(null);
      } catch (error) {
        if (error.message.includes('not authenticate')) {
          return <RedirectToLoginError message="Please login to update quests." />;
        }
      }
    };
  
    return (
      <div className="quest-container">
        <h1 className="quest-title">Create a Quest</h1>
        <div className="input-section">
          <input
            type="text"
            placeholder="Quest Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="quest-title-input"
          />
          {titleError && <p className="quest-error-message">{titleError}</p>}
  
          <textarea
            placeholder="Quest Details..."
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="quest-input"
          />
          {detailsError && <p className="quest-error-message">{detailsError}</p>}
  
          {/* New rewards input field */}
          <textarea
            placeholder="Quest Rewards..."
            value={rewards}
            onChange={(e) => setRewards(e.target.value)}
            className="quest-input"
          />
          {rewardsError && <p className="quest-error-message">{rewardsError}</p>}
  
          {editingIndex === null ? (
            <button className="save-quest-button" onClick={handleSave}>
              Save Quest
            </button>
          ) : (
            <button className="save-quest-button" onClick={handleUpdate}>
              Update Quest
            </button>
          )}
        </div>
  
        <h2 className="created-title">Existing Quests:</h2>
        <div className="quest-grid">
          {quests.length === 0 ? (
            <p>No quests created yet</p>
          ) : (
            quests.map((quest, index) => (
              <div className="quest-card" key={index}>
                <h3>{quest.title}</h3>
                <p>{quest.details}</p>
                <p><strong className="quest-rewards">Rewards:</strong> {quest.rewards}</p>
                <div className="quest-button-row">
                  <button className="quest-button-edit" onClick={() => handleEdit(index)}>Edit</button>
                  <button className="quest-button-delete" onClick={() => openDeleteModal(index)}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
  
        {/* Reactstrap Modal for delete confirmation */}
        <Modal isOpen={isModalOpen} toggle={closeDeleteModal} className="parchment-modal">
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalBody>
            Are you sure you want to delete this quest?
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
  
  export default Quests;