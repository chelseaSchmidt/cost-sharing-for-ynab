import styled from 'styled-components';
import { BaseButton, BackgroundOverlay } from './styledComponents';
import { ReactNode } from 'react';

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

interface Props {
  onClose: () => void;
  buttonText?: string;
  children: ReactNode;
  shouldCloseOnOverlayClick?: boolean;
}

const Modal = ({
  onClose,
  buttonText = 'OK',
  children,
  shouldCloseOnOverlayClick = false,
}: Props) => (
  <>
    <BackgroundOverlay
      onClick={shouldCloseOnOverlayClick ? onClose : undefined}
      role="button"
      aria-label="Modal overlay"
      tabIndex={0}
      onKeyDown={
        shouldCloseOnOverlayClick
          ? (e) => {
              if (e.key === 'Enter') onClose();
            }
          : undefined
      }
    />
    <Container>
      {children}
      <ButtonContainer>
        <BaseButton type="button" onClick={onClose}>
          {buttonText}
        </BaseButton>
      </ButtonContainer>
    </Container>
  </>
);

export default Modal;
