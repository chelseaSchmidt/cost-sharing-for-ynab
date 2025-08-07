import { ReactNode } from 'react';
import styled from 'styled-components';
import { Button } from '../../../shared/styledComponents';
import zIndices from '../../../shared/zIndices';
import { BackgroundOverlay } from './styledComponents';

/* Styled Components */

const Container = styled.div`
  position: fixed;
  z-index: ${zIndices.modal};
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
      onClick={() => shouldCloseOnOverlayClick && onClose()}
      role="button"
      aria-label="Modal overlay"
      tabIndex={0}
    />
    <Container>
      {children}
      <ButtonContainer>
        <Button type="button" onClick={onClose} autoFocus>
          {buttonText}
        </Button>
      </ButtonContainer>
    </Container>
  </>
);

export default Modal;
