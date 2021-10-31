import React from 'react';
import PropTypes from 'prop-types';
import Popup from './Popup';

const Error = ({
  errorData,
  setErrorData,
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
    <Popup
      onClose={() => setErrorData(null)}
      message={
        statusCodeErrorMessages[errorData.status]
        || statusCodeErrorMessages.defaultMessage
      }
      containerStyle={{ backgroundColor: '#8a2a2a' }}
      closeButtonStyle={{ color: '#8a2a2a' }}
    />
  );
};

Error.propTypes = {
  errorData: PropTypes.object.isRequired,
  setErrorData: PropTypes.func.isRequired,
};

export default Error;
