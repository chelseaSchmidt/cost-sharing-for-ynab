import { ReactNode } from 'react';
import styled from 'styled-components';
import { Button } from '../../../shared/styledComponents';
import zIndices from '../../../shared/zIndices';
import { BackgroundOverlay } from './styledComponents';

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

export const ScrollableArea = styled.div`
  overflow: auto;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;

  @supports (scrollbar-color: auto) {
    scrollbar-width: thin;
    scrollbar-color: rgb(0 0 0 / 0.1) transparent;
  }

  /* Chrome */
  @supports selector(::-webkit-scrollbar) {
    scrollbar-width: auto;
    scrollbar-color: auto;

    &::-webkit-scrollbar {
      background: transparent;
      height: 7px;
      width: 7px;
    }

    &::-webkit-scrollbar-thumb {
      background: rgb(0 0 0 / 0.1);
      border-radius: 5px;

      &:hover {
        background: rgb(0 0 0 / 0.3);
      }
    }
  }
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
      <ScrollableArea>{children}</ScrollableArea>

      <ButtonContainer>
        <Button type="button" onClick={onClose} autoFocus>
          {buttonText}
        </Button>
      </ButtonContainer>
    </Container>
  </>
);

export default Modal;
