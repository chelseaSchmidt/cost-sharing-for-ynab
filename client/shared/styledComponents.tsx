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
  background: rgba(0, 0, 0, 0.5);
`;

export const ScrollableArea = styled.div`
  --scroll-track-color: rgb(0 0 0 / 7%);
  --scroll-button-color: rgb(0 0 0 / 25%);
  --scroll-button-hover-color: rgb(0 0 0 / 35%);

  overflow: auto;
  scroll-behavior: smooth;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  border-top: 1px solid ${colors.lightNeutralBg};
  border-bottom: 1px solid ${colors.lightNeutralBg};

  @supports (scrollbar-color: auto) {
    scrollbar-width: thin;
    scrollbar-color: var(--scroll-button-color) var(--scroll-track-color);
  }

  /* Chrome */
  @supports selector(::-webkit-scrollbar) {
    scrollbar-width: auto;
    scrollbar-color: auto;

    &::-webkit-scrollbar {
      background: var(--scroll-track-color);
      height: 10px;
      width: 10px;
    }

    &::-webkit-scrollbar-thumb {
      background: var(--scroll-button-color);
      border-radius: 5px;

      &:hover {
        background: var(--scroll-button-hover-color);
      }
    }
  }
`;
