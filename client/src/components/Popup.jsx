import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: black;
  opacity: 95%;
  box-shadow: 0 0 5px 0 #4c4c4c;
  color: white;
  text-align: center;
  letter-spacing: 1px;
  font-size: 16px;
  position: fixed;
  top: 50vh;
  left: 0;
  box-sizing: border-box;
  width: 100vw;
  padding: 10px;
`;

const SmallExitButton = styled.button`
  background: none;
  border: none;
  box-sizing: border-box;
  height: fit-content;
  padding: 5px 10px;
  font-weight: bold;
  color: white;
  font-size: 16px;
  position: absolute;
  right: 0;
  top: 0;
  margin: 5px;

  :hover {
    cursor: pointer;
  }
`;

const LargeExitButton = styled.button`
  box-sizing: border-box;
  background-color: white;
  border: none;
  border-radius: 12px;
  width: 100px;
  padding: 5px;

  :hover {
    cursor: pointer;
  }
`;

const Popup = ({
  onClose,
  message,
  containerStyle,
  closeButtonStyle,
}) => (
  <Container style={containerStyle}>
    <div>
      <p>
        {message}
      </p>
      <SmallExitButton onClick={onClose}>
        X
      </SmallExitButton>
    </div>
    <LargeExitButton
      onClick={onClose}
      style={closeButtonStyle}
    >
      Close
    </LargeExitButton>
  </Container>
);

Popup.propTypes = {
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  containerStyle: PropTypes.object,
  closeButtonStyle: PropTypes.object,
};

export default Popup;
