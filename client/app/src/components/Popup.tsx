import { ReactNode } from 'react';
import styled from 'styled-components';
import breakpoints from '../../../shared/breakpoints';
import Button from '../../../shared/Button';
import colors from '../../../shared/colors';
import ExitIcon from '../../../shared/icons/ExitIcon';
import { FlexColumnAllCentered } from '../../../shared/styledComponents';
import zIndices from '../../../shared/zIndices';

type Theme = 'success' | 'default';

const ACCENT_COLOR = 'white';

const Container = styled(FlexColumnAllCentered)`
  position: fixed;
  z-index: ${zIndices.popup};
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-sizing: border-box;
  width: calc(100% - 10px);
  box-shadow: 0 0 5px 0 ${colors.shadow1};
  border-radius: 2px;
  padding: 10px;
  opacity: 90%;
  color: ${ACCENT_COLOR};
  text-align: center;
  letter-spacing: 1px;
  font-size: 16px;

  @media (max-width: ${breakpoints.tiny}) {
    text-align: left;
    font-size: 14px;
  }
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
  const mainColor = theme === 'success' ? colors.success : colors.primary;

  return (
    <Container style={{ background: mainColor }}>
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
