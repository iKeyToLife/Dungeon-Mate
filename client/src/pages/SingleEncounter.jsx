import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GET_ENCOUNTER } from '../utils/queries';

const SingleEncounter = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Capture encounterId from the URL
    const { loading, error, data } = useQuery(GET_ENCOUNTER, { variables: { encounterId: id } });
    const [encounter, setEncounter] = useState(null);

    useEffect(() => {
        if (data && data.encounter) {
            setEncounter(data.encounter);
        }
    }, [data]);

    if (loading) {
        return <div>Loading encounter data...</div>;
    }

    if (error) {
        return <div>Error loading encounter data. Please try again.</div>;
    }

    if (!encounter) {
        return <div>No encounter data found.</div>;
    }

    return (
        <div className="encounter-details">
            <h2>{encounter.title}</h2>
            <p><strong>Details:</strong> {encounter.details}</p>
            <div className="button-container">
                <button className="standard-button-encounter" onClick={() => window.history.back()}>
                    Go Back
                </button>
            </div>
        </div>
    );
};

export default SingleEncounter;