import styled from 'styled-components';
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

  &:last-of-type {
    margin-bottom: 0;
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
