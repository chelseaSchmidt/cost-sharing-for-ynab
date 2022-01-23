import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Container = styled.div`
  position: fixed;
  z-index: 5;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-sizing: border-box;
  width: 100vw;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 5px 0 #4c4c4c;
  background-color: black;
  opacity: 95%;
  color: white;
  text-align: center;
  letter-spacing: 1px;
  font-size: 16px;
`;

const Message = styled.div`
  margin: 10px 30px;
`;

const SmallExitButton = styled.button`
  background: none;
  border: none;
  box-sizing: border-box;
  height: fit-content;
  font-weight: bold;
  color: white;
  font-size: 16px;
  position: absolute;
  right: 0;
  top: 0;
  margin: 10px 20px;

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
  margin: 10px;

  :hover {
    cursor: pointer;
  }
`;

const Popup = ({
  onClose,
  message,
  buttonText = 'Close',
  containerStyle,
  closeButtonStyle,
}) => (
  <Container style={containerStyle}>
    <div>
      <Message>
        {message}
      </Message>

      <SmallExitButton onClick={onClose}>
        X
      </SmallExitButton>
    </div>

    <LargeExitButton
      onClick={onClose}
      style={closeButtonStyle}
    >
      {buttonText}
    </LargeExitButton>
  </Container>
);

Popup.propTypes = {
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  buttonText: PropTypes.string,
  containerStyle: PropTypes.object,
  closeButtonStyle: PropTypes.object,
};

export default Popup;
