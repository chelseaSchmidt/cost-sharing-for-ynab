import React from 'react';
import PropTypes from 'prop-types';
import Popup from './Popup';

const Confirmation = ({ setIsConfirmationVisible }) => (
  <Popup
    message="Transaction created"
    onClose={() => setIsConfirmationVisible(false)}
    containerStyle={{ backgroundColor: '#252525' }}
    closeButtonStyle={{ color: '#252525' }}
  />
);

Confirmation.propTypes = {
  setIsConfirmationVisible: PropTypes.func.isRequired,
};

export default Confirmation;
