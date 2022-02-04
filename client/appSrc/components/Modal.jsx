import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { BaseButton, BackgroundOverlay } from './styledComponents';

/* Styled Components */

const Container = styled.div`
  position: fixed;
  z-index: 6;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80vw;
  max-width: 1100px;
  max-height: 80vh;
  border-radius: 12px;
  box-shadow: 0 0 5px 0 #4c4c4c;
  padding: 20px;
  overflow-y: auto;
  background-color: white;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

/* Main Component */

const Modal = ({
  onClose,
  buttonText = 'OK',
  children,
  shouldCloseOnOverlayClick = false,
}) => (
  <>
    <BackgroundOverlay
      onClick={shouldCloseOnOverlayClick ? onClose : null}
      role="button"
      aria-label="Modal overlay"
      tabIndex={0}
      onKeyDown={
        shouldCloseOnOverlayClick
          ? (e) => { if (e.key === 'Enter') onClose(); }
          : null
      }
    />
    <Container>
      {children}
      <ButtonContainer>
        <BaseButton
          type="button"
          onClick={onClose}
        >
          {buttonText}
        </BaseButton>
      </ButtonContainer>
    </Container>
  </>
);

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  buttonText: PropTypes.string,
  children: PropTypes.node,
  shouldCloseOnOverlayClick: PropTypes.bool,
};

export default Modal;
