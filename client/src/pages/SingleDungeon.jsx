import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_DUNGEON } from '../utils/queries';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const SingleDungeon = () => {
    const { dungeonId } = useParams(); // Get dungeonId from URL
    const navigate = useNavigate();
    const { loading, error, data } = useQuery(GET_DUNGEON, { variables: { dungeonId } });
    const [dungeon, setDungeon] = useState(null);
  
    // Set dungeon data once it is retrieved
    useEffect(() => {
      if (data && data.dungeon) {
        setDungeon(data.dungeon);
      }
    }, [data]);
  
    if (loading) {
      return <div>Loading dungeon data...</div>;
    }
  
    if (error) {
      return <div>Error loading dungeon data. Please try again later.</div>;
    }
  
    if (!dungeon) {
      return <div>No dungeon data found.</div>;
    }
  
    return (
      <div className="dungeon-details-container">
        <h1>{dungeon.title}</h1>
        <p><strong>Description:</strong> {dungeon.description}</p>
  
        <div className="dungeon-encounters">
          <h2>Encounters</h2>
          {dungeon.encounters.length === 0 ? (
            <p>No encounters added</p>
          ) : (
            dungeon.encounters.map((encounter) => (
              <div key={encounter._id} className="encounter-item">
                <p>{encounter.title}</p>
              </div>
            ))
          )}
        </div>
  
        <div className="dungeon-quests">
          <h2>Quests</h2>
          {dungeon.quests.length === 0 ? (
            <p>No quests added</p>
          ) : (
            dungeon.quests.map((quest) => (
              <div key={quest._id} className="quest-item">
                <p>{quest.title}</p>
              </div>
            ))
          )}
        </div>
  
        <div className="button-container">
          <button className="standard-button-dungeon" onClick={() => navigate('/dungeons')}>
            Back to Dungeons
          </button>
        </div>
      </div>
    );
  };
  
  export default SingleDungeon;