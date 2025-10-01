import { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { BackgroundOverlay, Button } from '../../../shared/styledComponents';
import zIndices from '../../../shared/zIndices';
import { MODALS_CONTAINER_ID } from '../constants';
import { ScrollableArea } from './styledComponents';

/* Styled Components */

const Container = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
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
  background-color: white;
  overflow: hidden;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 20px;
`;

/* Main Component */

interface Props {
  onClose: () => void;
  buttonText?: string;
  children: ReactNode;
  shouldCloseOnOverlayClick?: boolean;
  shouldCloseOnEscape?: boolean;
}

export default function Modal({
  onClose,
  buttonText = 'OK',
  children,
  shouldCloseOnOverlayClick = false,
  shouldCloseOnEscape = false,
}: Props) {
  const modalsContainer = document.getElementById(MODALS_CONTAINER_ID);

  return modalsContainer
    ? createPortal(
        <>
          <BackgroundOverlay
            onClick={() => shouldCloseOnOverlayClick && onClose()}
            onKeyUp={(e) => shouldCloseOnOverlayClick && e.key === 'Escape' && onClose()}
            role="button"
            aria-label="Exit"
            tabIndex={0}
            aria-disabled={!shouldCloseOnOverlayClick}
          />

          <Container onKeyUp={(e) => shouldCloseOnEscape && e.key === 'Escape' && onClose()}>
            <ScrollableArea>{children}</ScrollableArea>

            <ButtonContainer>
              <Button type="button" onClick={onClose} autoFocus>
                {buttonText}
              </Button>
            </ButtonContainer>
          </Container>
        </>,
        modalsContainer,
      )
    : null;
}
