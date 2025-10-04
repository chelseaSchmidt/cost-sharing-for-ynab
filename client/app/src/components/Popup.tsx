import { ReactNode, useEffect, useState } from 'react';
import styled from 'styled-components';
import breakpoints from '../../../shared/breakpoints';
import Button from '../../../shared/Button';
import colors from '../../../shared/colors';
import ExitIcon from '../../../shared/icons/ExitIcon';
import { FlexColumnAllCentered } from '../../../shared/styledComponents';
import zIndices from '../../../shared/zIndices';

type Theme = 'success' | 'default';

const ACCENT_COLOR = 'white';

const Container = styled(FlexColumnAllCentered)<{ $revealed: boolean }>`
  --popup-width: 400px;
  --popup-max-height: 400px;

  position: fixed;
  z-index: ${zIndices.popup};
  bottom: 10px;
  right: calc(var(--popup-width) * -1);

  width: var(--popup-width);
  max-width: calc(100% - 10px);
  max-height: var(--popup-max-height);
  overflow: auto;

  box-sizing: border-box;
  box-shadow: 0 0 5px 0 ${colors.shadow1};
  border-radius: 2px;
  padding: 10px;
  opacity: 95%;
  color: ${ACCENT_COLOR};
  letter-spacing: 1px;
  font-size: 16px;

  @media (max-width: ${breakpoints.mobile}) {
    bottom: calc(var(--popup-max-height) * -1);
    left: 50%;
    transform: translateX(-50%);

    /* SLIDE-UP ANIMATION */
    transition: bottom 0.4s;
    ${(props) => props.$revealed && 'bottom: 120px;'}
  }

  @media (max-width: ${breakpoints.tiny}) {
    overflow-wrap: anywhere;
    text-align: left;
    font-size: 14px;
  }

  /* SLIDE-OUT ANIMATION */
  transition: right 0.4s;
  ${(props) => props.$revealed && 'right: 10px;'}
`;

const Message = styled.div`
  margin: 10px 40px;

  @media (max-width: ${breakpoints.mobile}) {
    margin: 30px 5px 5px 5px;
  }
`;

const CornerExitButton = styled(Button)`
  box-shadow: unset;
  background: unset;
  position: absolute;
  right: 0;
  top: 0;
  margin: 10px 20px;
  padding: 5px;

  &:hover {
    background: ${colors.mediumNeutralBg};
  }

  &:active {
    background: ${colors.lightNeutralActive};
  }
`;

const MainExitButton = styled(Button)`
  box-shadow: unset;
  background: ${ACCENT_COLOR};
  padding: 5px 20px;
  margin: 10px;
  font-size: 14px;

  @media (max-width: ${breakpoints.tiny}) {
    font-size: 12px;
  }

  &:hover {
    background: ${colors.lightNeutralBg};
  }

  &:active {
    background: ${colors.lightNeutralActive};
  }
`;

interface Props {
  children: ReactNode;
  theme?: Theme;
  buttonText?: string;
  onClose: () => void;
}

export default function Popup({
  children,
  theme = 'default',
  buttonText = 'Dismiss',
  onClose,
}: Props) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setTimeout(() => setRevealed(true), 50);
  }, []);

  const mainColor = theme === 'success' ? colors.success : colors.primary;

  return (
    <Container $revealed={revealed} style={{ background: mainColor }}>
      <Message>{children}</Message>

      <CornerExitButton onClick={onClose}>
        <ExitIcon color={ACCENT_COLOR} />
      </CornerExitButton>

      <MainExitButton onClick={onClose} style={{ color: mainColor }}>
        {buttonText}
      </MainExitButton>
    </Container>
  );
}
