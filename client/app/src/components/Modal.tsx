import { CSSProperties, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import breakpoints from '../../../shared/breakpoints';
import Button from '../../../shared/Button';
import colors from '../../../shared/colors';
import { BackgroundOverlay } from '../../../shared/styledComponents';
import zIndices from '../../../shared/zIndices';
import { MODALS_CONTAINER_ID } from '../constants';
import { ScrollableArea } from './styledComponents';

/* Styled Components */

const Container = styled.div`
  position: fixed;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  z-index: ${zIndices.modal};
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: calc(100vw - 60px);
  height: calc(100vh - 60px);
  max-width: 1100px;
  max-height: 700px;
  border-radius: 5px;
  box-shadow: 0 0 5px 0 ${colors.shadow1};
  padding: 20px;
  background: white;
  overflow: hidden;

  @media (max-width: ${breakpoints.mobile}) {
    width: calc(100% - 20px);
  }
`;

const Controls = styled.div`
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
  style?: CSSProperties;
}

export default function Modal({
  onClose,
  buttonText = 'OK',
  children,
  shouldCloseOnOverlayClick = false,
  shouldCloseOnEscape = false,
  style,
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

          <Container
            onKeyUp={(e) => shouldCloseOnEscape && e.key === 'Escape' && onClose()}
            style={style}
          >
            <ScrollableArea>{children}</ScrollableArea>

            <Controls>
              <Button onClick={onClose} autoFocus>
                {buttonText}
              </Button>
            </Controls>
          </Container>
        </>,
        modalsContainer,
      )
    : null;
}
