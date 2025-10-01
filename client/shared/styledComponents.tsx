import styled from 'styled-components';
import colors from './colors';
import zIndices from './zIndices';

export const FlexRow = styled.div`
  display: flex;
`;

export const FlexRowCenterAligned = styled(FlexRow)`
  align-items: center;
`;

export const FlexRowAllCentered = styled(FlexRowCenterAligned)`
  justify-content: center;
`;

export const FlexColumn = styled(FlexRow)`
  flex-direction: column;
`;

export const FlexColumnCentered = styled(FlexColumn)`
  align-items: center;
`;

export const FlexColumnAllCentered = styled(FlexColumnCentered)`
  justify-content: center;
`;

export const Paragraph = styled.p`
  all: unset;
  display: block;
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const Hyperlink = styled.a`
  all: unset;

  text-align: left;
  padding: 0;
  margin: 0 10px;
  cursor: pointer;
  text-decoration: underline;
  color: inherit;

  &:hover,
  &:visited:hover {
    color: ${colors.primary};
  }

  &:visited {
    color: inherit;
  }

  &:focus-visible {
    outline: 1px solid ${colors.primary};
    border-radius: 5px;
  }
`;

export const Button = styled.button`
  all: unset;
  cursor: pointer;
  box-sizing: border-box;
  background: ${colors.primary};
  border-radius: 5px;
  box-shadow: 0 1px 2px 0 #666;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: white;
  text-decoration: none;
  text-align: center;
  letter-spacing: 0.5px;

  &:hover {
    background: ${colors.lightNeutralAccent};
  }

  &:active {
    background: ${colors.buttonActive};
  }

  &:focus-visible {
    outline: 1px solid ${colors.buttonFocusOutline};
  }

  &:disabled {
    background: #999;
    cursor: not-allowed;
  }
`;

export const BackgroundOverlay = styled.div`
  position: fixed;
  z-index: ${zIndices.modalOverlay};
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: black;
  opacity: 50%;
`;
