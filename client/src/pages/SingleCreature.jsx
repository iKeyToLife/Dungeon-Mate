import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const SingleCreature = () => {
  const { id } = useParams();
  const [creature, setCreature] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCreature = async () => {
      try {
        console.log(`Fetching data for creature with ID: ${id}`);
        const response = await fetch(`https://www.dnd5eapi.co/api/monsters/${id}`);
        const data = await response.json();

        if (response.ok) {
          console.log('Creature data fetched successfully:', data);
          setCreature(data);
        } else {
          console.error('Error fetching data:', data);
          setError(data);
        }
      } catch (error) {
        console.error('Error during fetch:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCreature();
    } else {
      console.error('No ID found in URL');
    }
  }, [id]);

  if (loading) {
    return <div>Loading creature data...</div>;
  }

  if (error) {
    return <div>Error loading creature data. Please try again.</div>;
  }

  if (!creature) {
    console.log('Creature state is null');
    return <div>No creature data found.</div>;
  }

  const safeRender = (value) => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value);
    }
    return value;
  };

  return (
    <div className="creature-details">
      <h2>{safeRender(creature.name)}</h2>
      <p><strong>Challenge Rating:</strong> {safeRender(creature.challenge_rating)}</p>
      <p><strong>Type:</strong> {safeRender(creature.type)}</p>
      <p><strong>Size:</strong> {safeRender(creature.size)}</p>
      <p><strong>Alignment:</strong> {safeRender(creature.alignment)}</p>
      <p><strong>Armor Class:</strong> {safeRender(creature.armor_class)}</p>
      <p><strong>Hit Points:</strong> {safeRender(creature.hit_points)}</p>
      <p><strong>Actions:</strong></p>
      <ul>
        {creature.actions && creature.actions.length > 0 ? (
          creature.actions.map((action, index) => (
            <li key={index}>
              <strong>{safeRender(action.name)}:</strong> {safeRender(action.desc)}
            </li>
          ))
        ) : (
          <p>No actions available.</p>
        )}
      </ul>
      <button onClick={() => window.history.back()}>Back to Bestiary</button>
    </div>
  );
};

export default SingleCreature;