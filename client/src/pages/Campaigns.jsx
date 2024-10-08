import { useMutation, useQuery, useLazyQuery, useApolloClient } from '@apollo/client';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { ADD_CAMPAIGN, DELETE_CAMPAIGN, UPDATE_CAMPAIGN, ADD_ENCOUNTER_TO_CAMPAIGN, ADD_QUEST_TO_CAMPAIGN, ADD_DUNGEON_TO_CAMPAIGN, ADD_CREATURE_TO_CAMPAIGN, DELETE_CREATURE_FROM_CAMPAIGN } from '../utils/mutations';
import { GET_CAMPAIGNS, GET_ENCOUNTERS, GET_QUESTS, GET_DUNGEONS, GET_ENCOUNTER, GET_QUEST, GET_DUNGEON } from '../utils/queries';
import AuthService from '../utils/auth';

const Campaigns = () => {
  const client = useApolloClient();
  const [campaigns, setCampaigns] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [npcs, setNpcs] = useState('');
  const [notes, setNotes] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [encounterDropdownOpen, setEncounterDropdownOpen] = useState(false);
  const [questDropdownOpen, setQuestDropdownOpen] = useState(false);
  const [dungeonDropdownOpen, setDungeonDropdownOpen] = useState(false);
  const [creatureDropdownOpen, setCreatureDropdownOpen] = useState(false);
  const [selectedEncounters, setSelectedEncounters] = useState([]);
  const [selectedQuests, setSelectedQuests] = useState([]);
  const [selectedDungeons, setSelectedDungeons] = useState([]);
  const [selectedCreatures, setSelectedCreatures] = useState([]);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState(null);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedItems, setExpandedItems] = useState([]);
  const navigate = useNavigate();

  const [getEncounter] = useLazyQuery(GET_ENCOUNTER);
  const [getQuest] = useLazyQuery(GET_QUEST);
  const [getDungeon] = useLazyQuery(GET_DUNGEON);

  // Load encounters, quests, and dungeons from backend
  const { data: encountersData } = useQuery(GET_ENCOUNTERS);
  const { data: questsData } = useQuery(GET_QUESTS);
  const { data: dungeonsData } = useQuery(GET_DUNGEONS);

  // Load campaigns from backend
  const { data: campaignsData } = useQuery(GET_CAMPAIGNS, {
    onCompleted: (data) => {
      setCampaigns(data.campaigns || []);
    },
  });

  const [addCampaign] = useMutation(ADD_CAMPAIGN, {
    refetchQueries: [{ query: GET_CAMPAIGNS }],
  });

  const [deleteCampaign] = useMutation(DELETE_CAMPAIGN, {
    refetchQueries: [{ query: GET_CAMPAIGNS }],
  });

  const [updateCampaign] = useMutation(UPDATE_CAMPAIGN, {
    refetchQueries: [{ query: GET_CAMPAIGNS }],
  });

  const handleEditCampaign = (campaign) => {
    setIsEditing(true);
    setEditingId(campaign._id);
    setTitle(campaign.title);
    setDescription(campaign.description);
    setNpcs(campaign.npcs || '');
    setNotes(campaign.notes || '');
    setSelectedEncounters(campaign.encounters || []);
    setSelectedQuests(campaign.quests || []);
    setSelectedDungeons(campaign.dungeons || []);
    setSelectedCreatures(campaign.creatures || []);
  };

  const handleViewItem = async (item, type) => {
    try {
      let query;
      let variableName;

      if (type === 'encounter') {
        query = GET_ENCOUNTER;
        variableName = 'encounterId';
      } else if (type === 'quest') {
        query = GET_QUEST;
        variableName = 'questId';
      } else if (type === 'dungeon') {
        query = GET_DUNGEON;
        variableName = 'dungeonId';
      } else if (type === 'creature') {
        // Fetch creature data from the DnD API
        const response = await fetch(`https://www.dnd5eapi.co${item.url}`);
        const creatureData = await response.json();
        if (!response.ok) throw new Error('Failed to fetch creature data');
        setSelectedCreatures((prevCreatures) =>
          prevCreatures.map((creature) =>
            creature.index === item.index
              ? { ...creature, details: creatureData, expanded: !creature.expanded }
              : creature
          )
        );
        return;
      }

      // Fetch encounters, quests, and dungeons from GraphQL API
      const { data } = await client.query({
        query,
        variables: { [variableName]: item._id }
      });

      let expandedItemDetails;
      if (type === 'encounter') expandedItemDetails = data.encounter;
      else if (type === 'quest') expandedItemDetails = data.quest;
      else if (type === 'dungeon') expandedItemDetails = data.dungeon;

      // Set the expanded state for encounters, quests, and dungeons
      if (type === 'encounter') {
        setSelectedEncounters((prevEncounters) =>
          prevEncounters.map((enc) =>
            enc._id === item._id
              ? { ...enc, details: expandedItemDetails, expanded: !enc.expanded }
              : enc
          )
        );
      } else if (type === 'quest') {
        setSelectedQuests((prevQuests) =>
          prevQuests.map((quest) =>
            quest._id === item._id
              ? { ...quest, details: expandedItemDetails, expanded: !quest.expanded }
              : quest
          )
        );
      } else if (type === 'dungeon') {
        setSelectedDungeons((prevDungeons) =>
          prevDungeons.map((dungeon) =>
            dungeon._id === item._id
              ? { ...dungeon, details: expandedItemDetails, expanded: !dungeon.expanded }
              : dungeon
          )
        );
      }
    } catch (error) {
      console.error(`Error fetching ${type} details:`, error);
    }
  };

  const handleRemoveItem = (item, type) => {
    switch (type) {
      case 'encounter':
        setSelectedEncounters(selectedEncounters.filter(encounter => encounter._id !== item._id));
        break;
      case 'quest':
        setSelectedQuests(selectedQuests.filter(quest => quest._id !== item._id));
        break;
      case 'creature':
        setSelectedCreatures(selectedCreatures.filter(creature => creature.index !== item.index));
        break;
      case 'dungeon':
        setSelectedDungeons(selectedDungeons.filter(dungeon => dungeon._id !== item._id));
        break;
      default:
        break;
    }
  };

  const handleAddCreature = (creature) => {
    setSelectedCreatures([...selectedCreatures, creature]);
  };

  const handleUpdateCampaign = async () => {
    try {
      await updateCampaign({
        variables: { campaignId: editingId, title, description, npcs, notes },
      });

      setTitle('');
      setDescription('');
      setNpcs('');
      setNotes('');
      setIsEditing(false);
      setEditingId(null);
    } catch (err) {
      console.error('Error updating campaign:', err);
    }
  };

  const handleDeleteCampaign = async (campaignId) => {
    try {
      await deleteCampaign({ variables: { campaignId } });
    } catch (err) {
      console.error('Error deleting campaign:', err);
    }
  };

  const handleSave = async () => {
    const loggedIn = AuthService.loggedIn();
    if (!loggedIn) {
      setModalMessage('Please login to save campaigns.');
      setLoginModalOpen(true);
      return;
    }

    try {
      await addCampaign({
        variables: { title, description, npcs, notes },
      });

      setTitle('');
      setDescription('');
      setNpcs('');
      setNotes('');
      setSelectedEncounters([]);
      setSelectedQuests([]);
      setSelectedDungeons([]);
      setSelectedCreatures([]);
    } catch (err) {
      console.error('Error saving campaign:', err);
    }
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setCampaignToDelete(null);
  };

  const openDeleteModal = (campaignId) => {
    setCampaignToDelete(campaignId);
    setIsModalOpen(true);
  };

  // Drag-and-drop functionality
  const onDragStart = (e, item, type) => {
    e.dataTransfer.setData('item', JSON.stringify(item));
    e.dataTransfer.setData('type', type);
  };

  const onDrop = (e, dropType) => {
    e.preventDefault();
    const item = JSON.parse(e.dataTransfer.getData('item'));
    const type = e.dataTransfer.getData('type');

    if (dropType === 'encounter' && type === 'encounter') {
      setSelectedEncounters([...selectedEncounters, item]);
    } else if (dropType === 'quest' && type === 'quest') {
      setSelectedQuests([...selectedQuests, item]);
    } else if (dropType === 'dungeon' && type === 'dungeon') {
      setSelectedDungeons([...selectedDungeons, item]);
    } else if (dropType === 'creature' && type === 'creature') {
      setSelectedCreatures([...selectedCreatures, item]);
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  // Function for handling the search when the search button is clicked
  const handleCreatureSearch = async () => {
    try {
      setIsLoading(true);
      setError(null); // Reset the error state

      // Make the request to the DnD API with the search term
      const response = await fetch(
        `https://www.dnd5eapi.co/api/monsters?name=${searchTerm.toLowerCase()}`
      );

      const data = await response.json();

      // Set the search results if the API call is successful
      if (response.ok) {
        setSearchResults(data.results || []);
        if (data.results.length === 0) {
          setError('No creatures found');
        }
      } else {
        setError('Error fetching creatures');
      }
    } catch (err) {
      console.error('Error fetching creatures:', err);
      setError('Error fetching creatures');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="campaign-page">
      <div className="sidebar-container">
        <div className="sidebar scrollable">
          <p>{window.innerWidth <= 768 ? 'Select your creations to add!' : 'Drag & Drop your creations!'}</p>

          {/* Encounters Dropdown */}
          <div onClick={() => setEncounterDropdownOpen(!encounterDropdownOpen)} className="sidebar-dropdown">
            <h3>
              Created Encounters
              <span className={`dropdown-icon ${encounterDropdownOpen ? 'open' : ''}`}>&#9660;</span>
            </h3>
          </div>
          {encounterDropdownOpen && (
            <ul className="encounter-list">
              {encountersData?.encounters.map((encounter) => (
                <li key={encounter._id} className="draggable" draggable={!window.innerWidth <= 768} onDragStart={(e) => onDragStart(e, encounter, 'encounter')}>
                  <div className="sidebar-card">
                    <span>{encounter.title}</span>
                    <button onClick={() => navigate(`/encounter/${encounter._id}`)}>View</button>
                    {window.innerWidth <= 768 && <button onClick={() => setSelectedEncounters([...selectedEncounters, encounter])}>Add</button>}
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
              {questsData?.quests.map((quest) => (
                <li key={quest._id} className="draggable" draggable={!window.innerWidth <= 768} onDragStart={(e) => onDragStart(e, quest, 'quest')}>
                  <div className="sidebar-card">
                    <span>{quest.title}</span>
                    <button onClick={() => navigate(`/quest/${quest._id}`)}>View</button>
                    {window.innerWidth <= 768 && <button onClick={() => setSelectedQuests([...selectedQuests, quest])}>Add</button>}
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Dungeons Dropdown */}
          <div onClick={() => setDungeonDropdownOpen(!dungeonDropdownOpen)} className="sidebar-dropdown">
            <h3>
              Created Dungeons
              <span className={`dropdown-icon ${dungeonDropdownOpen ? 'open' : ''}`}>&#9660;</span>
            </h3>
          </div>
          {dungeonDropdownOpen && (
            <ul className="dungeon-list">
              {dungeonsData?.dungeons.map((dungeon) => (
                <li key={dungeon._id} className="draggable" draggable={!window.innerWidth <= 768} onDragStart={(e) => onDragStart(e, dungeon, 'dungeon')}>
                  <div className="sidebar-card">
                    <span>{dungeon.title}</span>
                    <button onClick={() => navigate(`/dungeon/${dungeon._id}`)}>View</button>
                    {window.innerWidth <= 768 && <button onClick={() => setSelectedDungeons([...selectedDungeons, dungeon])}>Add</button>}
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Creatures Dropdown */}
          <div onClick={() => setCreatureDropdownOpen(!creatureDropdownOpen)} className="sidebar-dropdown">
            <h3>
              Creatures
              <span className={`dropdown-icon ${creatureDropdownOpen ? 'open' : ''}`}>&#9660;</span>
            </h3>
          </div>
          {creatureDropdownOpen && (
            <div className="creature-search-container">
              {/* Search Bar */}
              <input
                type="text"
                placeholder="Search Creatures..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-bar"
              />
              {/* Search Button */}
              <button onClick={handleCreatureSearch} className="search-button">
                Search
              </button>

              {/* Results or Messages */}
              {isLoading ? (
                <p>Loading creatures...</p>
              ) : error ? (
                <p className="error-message">{error}</p>
              ) : searchResults.length === 0 && searchTerm && !isLoading ? (
                <p>No creatures found</p>
              ) : (
                <ul className="creature-list">
                  {searchResults.map((creature) => (
                    <li
                      key={creature.index}
                      className="draggable"
                      draggable
                      onDragStart={(e) => onDragStart(e, creature, 'creature')}
                    >
                      <div className="sidebar-card">
                        <span>{creature.name}</span>
                        <button onClick={() => setSelectedCreatures([...selectedCreatures, creature])}>
                          Add
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="campaign-container">
        <h1 className="campaign-title">Create a Campaign</h1>
        <div className="input-section">
          <input type="text" placeholder="Campaign Title..." value={title} onChange={(e) => setTitle(e.target.value)} className="dungeon-title-input" />
          <textarea placeholder="Campaign Description..." value={description} onChange={(e) => setDescription(e.target.value)} className="dungeon-input" />
          <textarea placeholder="Are there NPCs?" value={npcs} onChange={(e) => setNpcs(e.target.value)} className="dungeon-input" />
          <textarea placeholder="Notes..." value={notes} onChange={(e) => setNotes(e.target.value)} className="dungeon-input" />

          {/* Drag-and-drop zones */}
          <div className="campaign-dropzone-container">
            {/* Encounters Dropzone */}
            <div className="encounter-dropzone2" onDragOver={onDragOver} onDrop={(e) => onDrop(e, 'encounter')}>
              <h3>Encounters:</h3>
              {selectedEncounters.length === 0 ? (
                <p>Add encounters here</p>
              ) : (
                selectedEncounters.map((encounter) => (
                  <div className="campaign-card" key={encounter._id}>
                    <h3>{encounter.title}</h3>
                    {encounter.expanded && encounter.details && (
                      <div className="expanded-details">
                        <p><strong>Description:</strong> {encounter.details.description}</p>
                        {/* Add other encounter details here */}
                      </div>
                    )}
                    <div className="campaign-button-row">
                      <button className="campaign-button-view" onClick={() => handleViewItem(encounter, 'encounter')}>
                        {encounter.expanded ? 'Collapse' : 'View'}
                      </button>
                      <button className="campaign-button-remove" onClick={() => handleRemoveItem(encounter, 'encounter')}>
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Quests Dropzone */}
            <div className="quest-dropzone2" onDragOver={onDragOver} onDrop={(e) => onDrop(e, 'quest')}>
              <h3>Quests:</h3>
              {selectedQuests.length === 0 ? (
                <p>Add quests here</p>
              ) : (
                selectedQuests.map((quest) => (
                  <div className="campaign-card" key={quest._id}>
                    <h3>{quest.title}</h3>
                    {quest.expanded && quest.details && (
                      <div className="expanded-details">
                        <p><strong>Details:</strong> {quest.details.objective}</p>
                        <p><strong>Reward:</strong> {quest.details.reward}</p>
                      </div>
                    )}
                    <div className="campaign-button-row">
                      <button className="campaign-button-view" onClick={() => handleViewItem(quest, 'quest')}>
                        {quest.expanded ? 'Collapse' : 'View'}
                      </button>
                      <button className="campaign-button-remove" onClick={() => handleRemoveItem(quest, 'quest')}>
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Dungeons Dropzone */}
            <div className="dungeon-dropzone" onDragOver={onDragOver} onDrop={(e) => onDrop(e, 'dungeon')}>
              <h3>Dungeons:</h3>
              {selectedDungeons.length === 0 ? (
                <p>Add dungeons here</p>
              ) : (
                selectedDungeons.map((dungeon) => (
                  <div className="campaign-card" key={dungeon._id}>
                    <h3>{dungeon.title}</h3>
                    {dungeon.expanded && dungeon.details && (
                      <div className="expanded-details">
                        <p><strong>Description:</strong> {dungeon.details.description}</p>
                        <p><strong>Encounters:</strong> {dungeon.details.encounters.map(enc => enc.title).join(', ')}</p>
                        <p><strong>Quests:</strong> {dungeon.details.quests.map(quest => quest.title).join(', ')}</p>
                      </div>
                    )}
                    <div className="campaign-button-row">
                      <button className="campaign-button-view" onClick={() => handleViewItem(dungeon, 'dungeon')}>
                        {dungeon.expanded ? 'Collapse' : 'View'}
                      </button>
                      <button className="campaign-button-remove" onClick={() => handleRemoveItem(dungeon, 'dungeon')}>
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Creatures Dropzone */}
            <div className="creature-dropzone2" onDragOver={onDragOver} onDrop={(e) => onDrop(e, 'creature')}>
              <h3>Creatures:</h3>
              {selectedCreatures.length === 0 ? (
                <p>Add creatures here</p>
              ) : (
                selectedCreatures.map((creature) => (
                  <div className="campaign-card" key={creature.index}>
                    <h3>{creature.name}</h3>
                    {creature.expanded && creature.details && (
                      <div className="expanded-details">
                        <p><strong>Type:</strong> {creature.details.type}</p>
                        <p><strong>Hit Points:</strong> {creature.details.hit_points}</p>
                        <p><strong>Armor Class:</strong> {creature.details.armor_class}</p>
                        <p><strong>Actions:</strong> {creature.details.actions.map(action => action.name).join(', ')}</p>
                      </div>
                    )}
                    <div className="campaign-button-row">
                      <button className="campaign-button-view" onClick={() => handleViewItem(creature, 'creature')}>
                        {creature.expanded ? 'Collapse' : 'View'}
                      </button>
                      <button className="campaign-button-remove" onClick={() => handleRemoveItem(creature, 'creature')}>
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <button className="save-campaign-button" onClick={handleSave}>
            {isEditing ? 'Update Campaign' : 'Save Campaign'}
          </button>
        </div>

        <div className="existing-campaigns-container">
          <h2>Existing Campaigns:</h2>
          <div className="campaign-grid">
            {campaigns.length === 0 ? <p>No campaigns created yet</p> : campaigns.map((campaign) => (
              <div className="campaign-card" key={campaign._id}>
                <h3>{campaign.title}</h3>
                <p>{campaign.description}</p>

                <div className="campaign-button-row">
                  <button onClick={() => handleEditCampaign(campaign)}>Edit</button>
                  <button onClick={() => openDeleteModal(campaign._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal for delete confirmation */}
        <Modal isOpen={isModalOpen} toggle={closeDeleteModal} className="parchment-modal">
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalBody>Are you sure you want to delete this campaign?</ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={() => handleDeleteCampaign(campaignToDelete)}>Yes, Delete</Button>
            <Button color="secondary" onClick={closeDeleteModal}>No, Cancel</Button>
          </ModalFooter>
        </Modal>

        {/* Modal for login requirement */}
        <Modal isOpen={loginModalOpen} toggle={() => setLoginModalOpen(false)} className="parchment-modal">
          <ModalHeader>Error</ModalHeader>
          <ModalBody>{modalMessage}</ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={() => setLoginModalOpen(false)}>OK</Button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  );
};

export default Campaigns;