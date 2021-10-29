import React from 'react';
import '../styles/Error.css';
import PropTypes from 'prop-types';

const Error = ({
  error,
  setError,
}) => {
  const statusCodeErrorMessages = {
    defaultMessage: (
      'An error occurred. Please start a new session and try again. If that does not resolve the issue, please send an email with the details to cost.sharing.for.ynab@gmail.com. Thank you for your patience!'
    ),
    401: (
      'Error: Authentication failed. This is normal if you\'re previewing the app without credentials. Otherwise, your session may have expired.'
    ),
  };

  return (
    <div id="error-container">
      <div id="error">
        <div>
          <p>
            {
              statusCodeErrorMessages[error.status]
              || statusCodeErrorMessages.defaultMessage
            }
          </p>
          <button
            type="button"
            className="exit-btn"
            onClick={() => setError(null)}
          >
            X
          </button>
        </div>
        <button
          type="button"
          className="close-btn"
          onClick={() => setError(null)}
        >
          Close
        </button>
      </div>
    </div>
  );
};

Error.propTypes = {
  error: PropTypes.object.isRequired,
  setError: PropTypes.func.isRequired,
};

export default Error;
