import { useQuery } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import { GET_QUEST } from '../utils/queries';

const SingleQuest = () => {
  const navigate = useNavigate();
  const { questId } = useParams();
  const { loading, error, data } = useQuery(GET_QUEST, {
    variables: { questId },
  });

  if (loading) {
    return <div>Loading quest data...</div>;
  }

  if (error) {
    return <div>Error loading quest data. Please try again.</div>;
  }

  const quest = data?.quest;

  if (!quest) {
    return <div>No quest data found.</div>;
  }

  return (
    <div className="quest-details">
      <h2>{quest.title}</h2>
      <p><strong>Details:</strong> {quest.details}</p>
      <p><strong>Rewards:</strong> {quest.rewards}</p>
      <div className="button-container">
        <button className="standard-button" onClick={() => window.history.back()}>
          Go Back
        </button>
      </div>
    </div>
  );
};

export default SingleQuest;