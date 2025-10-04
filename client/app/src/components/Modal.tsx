import { CSSProperties, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import breakpoints from '../../../shared/breakpoints';
import Button from '../../../shared/Button';
import colors from '../../../shared/colors';
import { APP_MIN_WIDTH } from '../../../shared/constants';
import useEscapeListener from '../../../shared/hooks/useEscapeListener';
import { BackgroundOverlay, FlexColumn, ScrollableArea } from '../../../shared/styledComponents';
import zIndices from '../../../shared/zIndices';
import { MODALS_CONTAINER_ID } from '../constants';

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
    height: calc(100vh - 120px);
    width: calc(100% - 20px);
  }
`;

const Controls = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 20px;
`;

const MinWidthContainer = styled(FlexColumn)`
  min-width: ${APP_MIN_WIDTH};
`;

/* Main Component */

interface Props {
  onClose: () => void;
  buttonText?: string;
  children: ReactNode;
  shouldCloseOnOverlayClick?: boolean;
  shouldCloseOnEscape?: boolean;
  shouldDisableScroll?: boolean;
  style?: CSSProperties;
}

export default function Modal({
  onClose,
  buttonText = 'OK',
  children,
  shouldCloseOnOverlayClick = false,
  shouldCloseOnEscape = false,
  shouldDisableScroll = false,
  style,
}: Props) {
  const modalsContainer = document.getElementById(MODALS_CONTAINER_ID);

  useEscapeListener(() => shouldCloseOnEscape && onClose());

  return modalsContainer
    ? createPortal(
        <>
          <BackgroundOverlay
            onClick={() => shouldCloseOnOverlayClick && onClose()}
            role="button"
            aria-label="Exit"
            tabIndex={0}
            aria-disabled={!shouldCloseOnOverlayClick}
          />

          <Container style={style} role="dialog" aria-modal="true">
            <ScrollableArea>
              <MinWidthContainer style={shouldDisableScroll ? { overflow: 'hidden' } : {}}>
                {children}
              </MinWidthContainer>
            </ScrollableArea>

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
