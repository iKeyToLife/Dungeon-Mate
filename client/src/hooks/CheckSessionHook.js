import { useNavigate } from 'react-router-dom';

export const useCheckSessionBeforeDelete = (isLoggedIn, deleteEncounter) => {
  const navigate = useNavigate();

  const checkSession = () => {
    if (!isLoggedIn) {
      return (
        <div className="modal-container">
          <div className="modal-content">
            <h2>Session Expired</h2>
            <p>Your session has expired. Please log in again to proceed.</p>
            <button onClick={() => navigate('/login')}>OK</button>
          </div>
        </div>
      );
    }

    // If session is valid, proceed with the deletion
    deleteEncounter();
    return null;
  };

  return { checkSession };
};