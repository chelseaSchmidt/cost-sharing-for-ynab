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
      'Warning: Unable to authenticate. This is normal if you\'re previewing the app without a YNAB account. Otherwise, your session may have expired.'
    ),
  };

  return (
    <Popup
      onClose={() => setErrorData(null)}
      message={
        statusCodeErrorMessages[errorData.status]
        || statusCodeErrorMessages.defaultMessage
      }
      containerStyle={{ backgroundColor: '#2a558a' }}
      closeButtonStyle={{ color: '#2a558a' }}
    />
  );
};

Error.propTypes = {
  errorData: PropTypes.object.isRequired,
  setErrorData: PropTypes.func.isRequired,
};

export default Error;
