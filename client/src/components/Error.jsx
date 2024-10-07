import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

// Component for errors that redirect to login/signup page
export const RedirectToLoginError = ({ message }) => {
  const navigate = useNavigate();

  const handleOkClick = () => {
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="modal-container">
      <div className="modal-content">
        <h2>Error</h2>
        <p>{message}</p>
        <button onClick={handleOkClick}>OK</button>
      </div>
    </div>
  );
};

// Define PropTypes for RedirectToLoginError
RedirectToLoginError.propTypes = {
  message: PropTypes.string.isRequired,
};

// Component for errors that do NOT redirect
export const NoRedirectError = ({ message, onClose }) => {
  return (
    <div className="modal-container">
      <div className="modal-content">
        <h2>Error</h2>
        <p>{message}</p>
        <button onClick={onClose}>OK</button>
      </div>
    </div>
  );
};

// Define PropTypes for NoRedirectError
NoRedirectError.propTypes = {
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};