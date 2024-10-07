import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_DUNGEON } from '../utils/queries';
import { Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';

const SingleDungeon = () => {
    const navigate = useNavigate();
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_DUNGEON, {
    variables: { dungeonId: id },
  });

  if (loading) {
    return <div>Loading dungeon data...</div>;
  }

  if (error) {
    return <div>Error loading dungeon data. Please try again.</div>;
  }

  const dungeon = data?.dungeon;

  if (!dungeon) {
    return <div>No dungeon data found.</div>;
  }

  return (
    <div className="dungeon-details">
      <h2>{dungeon.title}</h2>
      <p><strong>Description:</strong> {dungeon.description}</p>

      <h3>Encounters</h3>
      <ul>
        {dungeon.encounters.map((encounter, index) => (
          <li key={index}>
            <Button onClick={() => window.location.href = `/encounter/${encounter.id}`}>
              {encounter.title}
            </Button>
          </li>
        ))}
      </ul>

      <h3>Quests</h3>
      <ul>
        {dungeon.quests.map((quest, index) => (
          <li key={index}>
            <Button onClick={() => window.location.href = `/quest/${quest.id}`}>
              {quest.title}
            </Button>
          </li>
        ))}
      </ul>
      <div className="button-container">
      <button className="standard-button" onClick={() => navigate('/dungeons')}>Back to Dungeons</button>
      </div>
    </div>
  );
};

export default SingleDungeon;