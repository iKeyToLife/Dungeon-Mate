import { useMutation, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { RedirectToLoginError } from '../components/Error';
import AuthService from '../utils/auth';
import { ADD_DUNGEON, ADD_ENCOUNTER_TO_DUNGEON, ADD_QUEST_TO_DUNGEON, DELETE_DUNGEON, REMOVE_ENCOUNTER_FROM_DUNGEON, REMOVE_QUEST_FROM_DUNGEON, UPDATE_DUNGEON } from '../utils/mutations';
import { GET_DUNGEONS, GET_ENCOUNTERS, GET_QUESTS } from '../utils/queries';

const Dungeons = () => {
    const [dungeons, setDungeons] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);
    const [titleError, setTitleError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dungeonToDelete, setDungeonToDelete] = useState(null);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [dungeonEncounters, setDungeonEncounters] = useState([]);
    const [dungeonQuests, setDungeonQuests] = useState([]);
    const [encounterDropdownOpen, setEncounterDropdownOpen] = useState(false);
    const [questDropdownOpen, setQuestDropdownOpen] = useState(false);
    const [updateDungeon] = useMutation(UPDATE_DUNGEON);
    const [deleteDungeon] = useMutation(DELETE_DUNGEON);
    const dungeonsResult = useQuery(GET_DUNGEONS);
    const encountersResult = useQuery(GET_ENCOUNTERS);
    const questsResult = useQuery(GET_QUESTS);
    const [addEncounterToDungeon] = useMutation(ADD_ENCOUNTER_TO_DUNGEON);
    const [addQuestToDungeon] = useMutation(ADD_QUEST_TO_DUNGEON);
    const [removeEncounterFromDungeon] = useMutation(REMOVE_ENCOUNTER_FROM_DUNGEON);
    const [removeQuestFromDungeon] = useMutation(REMOVE_QUEST_FROM_DUNGEON);
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile screen width
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Load dungeon data from localStorage when the component mounts
    useEffect(() => {
        const savedDungeon = localStorage.getItem('unsavedDungeon');
        if (savedDungeon) {
            const { title, description, encounters, quests, isEdit } = JSON.parse(savedDungeon);
            setTitle(title || '');
            setDescription(description || '');
            setDungeonEncounters(encounters || []);
            setDungeonQuests(quests || []);
            setEditingIndex(isEdit || null);
        }
    }, []);

    // Save the dungeon state to localStorage on updates to title, description, encounters, or quests
    useEffect(() => {
        const unsavedDungeon = { title, description, encounters: dungeonEncounters, quests: dungeonQuests, isEdit: editingIndex };
        localStorage.setItem('unsavedDungeon', JSON.stringify(unsavedDungeon));
    }, [title, description, dungeonEncounters, dungeonQuests, editingIndex]);

    useEffect(() => {
        if (dungeonsResult.data && dungeonsResult.data.dungeons) {
            setDungeons(dungeonsResult.data.dungeons);
        }
    }, [dungeonsResult]);

    const [addDungeon] = useMutation(ADD_DUNGEON, {
        onError: (error) => {
            if (error.message.includes('not authenticate')) {
                setModalMessage('Please login to save dungeons.');
                setLoginModalOpen(true);
            }
        }
    });

    const handleAddEncounter = (encounter) => {
        setDungeonEncounters([...dungeonEncounters, encounter]);
    };

    const handleAddQuest = (quest) => {
        setDungeonQuests([...dungeonQuests, quest]);
    };

    // Drag-and-Drop Handlers
    const onDragStart = (e, item, type) => {
        e.dataTransfer.setData('item', JSON.stringify(item));
        e.dataTransfer.setData('type', type);
    };

    const onDrop = (e, dropType) => {
        e.preventDefault();
        const item = JSON.parse(e.dataTransfer.getData('item'));
        const type = e.dataTransfer.getData('type');

        if (dropType === 'encounter' && type === 'encounter') {
            setDungeonEncounters([...dungeonEncounters, item]);
        } else if (dropType === 'quest' && type === 'quest') {
            setDungeonQuests([...dungeonQuests, item]);
        }
    };

    const onDragOver = (e) => {
        e.preventDefault();
    };

    const openDeleteModal = (index) => {
        setDungeonToDelete(index);
        setIsModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsModalOpen(false);
        setDungeonToDelete(null);
    };

    const handleDelete = async () => {
        try {
            await deleteDungeon({
                variables: { dungeonId: dungeons[dungeonToDelete]._id },
                refetchQueries: [{ query: GET_DUNGEONS }]
            });
            closeDeleteModal();
        } catch (error) {
            if (error.message.includes('not authenticated')) {
                return <RedirectToLoginError message="Please login to delete dungeons." />;
            }
        }
    };

    const handleSave = async () => {
        let valid = true;
        setTitleError('');
        setDescriptionError('');

        if (title.trim() === '') {
            setTitleError('Please enter a title for your dungeon');
            valid = false;
        }
        if (description.trim() === '') {
            setDescriptionError('Please enter some details for your dungeon');
            valid = false;
        }

        if (valid) {
            const loggedIn = AuthService.loggedIn();
            if (!loggedIn) {
                return <RedirectToLoginError message="Please login to save dungeons." />;
            }

            try {
                const { data } = await addDungeon({
                    variables: { title, description },
                    refetchQueries: [{ query: GET_DUNGEONS }]
                });

                const newDungeonId = data.addDungeon._id;

                for (const encounter of dungeonEncounters) {
                    await addEncounterToDungeon({
                        variables: { dungeonId: newDungeonId, encounterId: encounter._id },
                    });
                }

                for (const quest of dungeonQuests) {
                    await addQuestToDungeon({
                        variables: { dungeonId: newDungeonId, questId: quest._id },
                    });
                }

                // Clear the form and state after successful save
                setTitle('');
                setDescription('');
                setDungeonEncounters([]);
                setDungeonQuests([]);
                localStorage.removeItem('unsavedDungeon');

            } catch (err) {
                console.error("Dungeon saving failed", err);
            }
        }
    };

    const handleEdit = (index) => {
        console.log("Editing index:", index);
        const selectedDungeon = dungeons[index];

        setEditingIndex(index);

        // Populate the title and description fields
        setTitle(selectedDungeon.title);
        setDescription(selectedDungeon.description);

        // Populate the encounters and quests fields
        setDungeonEncounters(selectedDungeon.encounters);
        setDungeonQuests(selectedDungeon.quests);

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleUpdate = async () => {
        if (editingIndex !== null) {
            try {
                const { data } = await updateDungeon({
                    variables: { dungeonId: dungeons[editingIndex]._id, title, description },
                });

                const updatedDungeonId = data.updateDungeon._id;

                // Get the original encounters and quests for comparison
                const originalEncounters = dungeons[editingIndex].encounters;
                const originalQuests = dungeons[editingIndex].quests;

                // Ensure encounters aren't added multiple times
                const existingEncounterIds = originalEncounters.map(encounter => encounter._id);
                const encountersToAdd = dungeonEncounters.filter(encounter => !existingEncounterIds.includes(encounter._id));

                for (const encounter of encountersToAdd) {
                    await addEncounterToDungeon({
                        variables: { dungeonId: updatedDungeonId, encounterId: encounter._id },
                    });
                }

                // Remove encounters that were deleted
                const encountersToRemove = originalEncounters.filter(encounter =>
                    !dungeonEncounters.some(e => e._id === encounter._id));

                for (const encounter of encountersToRemove) {
                    await removeEncounterFromDungeon({
                        variables: { dungeonId: updatedDungeonId, encounterId: encounter._id },
                    });
                }

                // Ensure quests aren't added multiple times
                const existingQuestIds = originalQuests.map(quest => quest._id);
                const questsToAdd = dungeonQuests.filter(quest => !existingQuestIds.includes(quest._id));

                for (const quest of questsToAdd) {
                    await addQuestToDungeon({
                        variables: { dungeonId: updatedDungeonId, questId: quest._id },
                    });
                }

                // Remove quests that were deleted
                const questsToRemove = originalQuests.filter(quest =>
                    !dungeonQuests.some(q => q._id === quest._id));

                for (const quest of questsToRemove) {
                    await removeQuestFromDungeon({
                        variables: { dungeonId: updatedDungeonId, questId: quest._id },
                    });
                }

                // Clear form and state after update
                setTitle('');
                setDescription('');
                setDungeonEncounters([]);
                setDungeonQuests([]);
                setEditingIndex(null);
                localStorage.removeItem('unsavedDungeon');

            } catch (error) {
                console.error('Error updating dungeon:', error);
            }
        }
    };

    return (
        <div className="dungeon-page">
            <div className="sidebar-container">
                <div className="sidebar scrollable">
                    <p>{isMobile ? "Select your creations to add!" : "Drag & Drop your creations!"}</p> {/* Conditional message based on isMobile */}

                    {/* Encounters Dropdown */}
                    <div onClick={() => setEncounterDropdownOpen(!encounterDropdownOpen)} className="sidebar-dropdown">
                        <h3>
                            Created Encounters
                            <span className={`dropdown-icon ${encounterDropdownOpen ? 'open' : ''}`}>&#9660;</span>
                        </h3>
                    </div>
                    {encounterDropdownOpen && (
                        <ul className="encounter-list">
                            {encountersResult.data?.encounters.map((encounter) => (
                                <li key={encounter._id} className="draggable" draggable={!isMobile} onDragStart={(e) => onDragStart(e, encounter, 'encounter')}>
                                    <div className="sidebar-card">
                                        <span>{encounter.title}</span>
                                        <button onClick={() => navigate(`/encounter/${encounter._id}`)}>View</button>
                                        {/* "Add" button for mobile */}
                                        {isMobile && (
                                            <button onClick={() => handleAddEncounter(encounter)}>Add</button>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* Quests Dropdown */}
                    <div onClick={() => setQuestDropdownOpen(!questDropdownOpen)} className="sidebar-dropdown">
                        <h3>
                            Created Quests
                            <span className={`dropdown-icon ${questDropdownOpen ? 'open' : ''}`}>&#9660;</span>
                        </h3>
                    </div>
                    {questDropdownOpen && (
                        <ul className="quest-list">
                            {questsResult.data?.quests.map((quest) => (
                                <li key={quest._id} className="draggable" draggable={!isMobile} onDragStart={(e) => onDragStart(e, quest, 'quest')}>
                                    <div className="sidebar-card">
                                        <span>{quest.title}</span>
                                        <button onClick={() => navigate(`/quest/${quest._id}`)}>View</button>
                                        {/* Add" button for mobile */}
                                        {isMobile && (
                                            <button onClick={() => handleAddQuest(quest)}>Add</button>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <div className="dungeon-container">
                <h1 className="dungeon-title">Create a Dungeon</h1>
                <div className="input-section">
                    <input
                        type="text"
                        placeholder="Dungeon Title..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="dungeon-title-input"
                    />
                    {titleError && <p className="dungeon-error-message">{titleError}</p>}

                    <textarea
                        placeholder="Dungeon Description..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="dungeon-input"
                    />
                    {descriptionError && <p className="dungeon-error-message">{descriptionError}</p>}

                    <div className="dungeon-subcontainer">
                        <div className="encounter-dropzone" onDragOver={onDragOver} onDrop={(e) => onDrop(e, 'encounter')}>
                            <h3>Encounters:</h3>
                            {dungeonEncounters.length === 0 ? (
                                <p>No encounters added</p>
                            ) : (
                                dungeonEncounters.map((encounter, idx) => (
                                    <div key={idx} className="encounter-item">
                                        <p>{encounter.title}</p>
                                        <div className="dungeon-button-row">
                                            <button onClick={() => navigate(`/encounter/${encounter._id}`)} className="dungeon-button-view">View</button>
                                            <button onClick={() => setDungeonEncounters(dungeonEncounters.filter((_, i) => i !== idx))} className="dungeon-button-remove">Remove</button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="quest-dropzone" onDragOver={onDragOver} onDrop={(e) => onDrop(e, 'quest')}>
                            <h3>Quests:</h3>
                            {dungeonQuests.length === 0 ? (
                                <p>No quests added</p>
                            ) : (
                                dungeonQuests.map((quest, idx) => (
                                    <div key={idx} className="quest-item">
                                        <p>{quest.title}</p>
                                        <div className="dungeon-button-row">
                                            <button onClick={() => navigate(`/quest/${quest._id}`)} className="dungeon-button-view">View</button>
                                            <button onClick={() => setDungeonQuests(dungeonQuests.filter((_, i) => i !== idx))} className="dungeon-button-remove">Remove</button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {editingIndex === null ? (
                        <button className="save-dungeon-button" onClick={handleSave}>
                            Save Dungeon
                        </button>
                    ) : (
                        <button className="save-dungeon-button" onClick={handleUpdate}>
                            Update Dungeon
                        </button>
                    )}
                </div>

                <div className="existing-dungeons-container">
                    <h2 className="created-title">Existing Dungeons:</h2>
                    <div className="dungeon-grid">
                        {dungeons.length === 0 ? (
                            <p>No dungeons created yet</p>
                        ) : (
                            dungeons.map((dungeon, index) => (
                                <div className="dungeon-card" key={index}>
                                    <h3>{dungeon.title}</h3>
                                    <p>{dungeon.description}</p>

                                    <div className="dungeon-encounters">
                                        <h4>Encounters:</h4>
                                        {dungeon.encounters.length === 0 ? (
                                            <p>No encounters added</p>
                                        ) : (
                                            dungeon.encounters.map((encounter, idx) => (
                                                <div key={idx} className="encounter-item">
                                                    <p><strong>Encounter: </strong>{encounter.title}</p>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    <div className="dungeon-quests">
                                        <h4>Quests:</h4>
                                        {dungeon.quests.length === 0 ? (
                                            <p>No quests added</p>
                                        ) : (
                                            dungeon.quests.map((quest, idx) => (
                                                <div key={idx} className="quest-item">
                                                    <p><strong>Quest: </strong>{quest.title}</p>
                                                    <p><strong>Reward: </strong>{quest.rewards}</p>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    <div className="dungeon-button-row">
                                        <button className="dungeon-button-view" onClick={() => navigate(`/dungeon/${dungeon._id}`)}>View</button>
                                        <button className="dungeon-button-edit" onClick={() => handleEdit(index)}>Edit</button>
                                        <button className="dungeon-button-delete" onClick={() => openDeleteModal(index)}>Delete</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Modal for delete confirmation */}
                <Modal isOpen={isModalOpen} toggle={closeDeleteModal} className="parchment-modal">
                    <ModalHeader>Confirm Delete</ModalHeader>
                    <ModalBody>
                        Are you sure you want to delete this dungeon?
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
        </div>
    );
};

export default Dungeons;