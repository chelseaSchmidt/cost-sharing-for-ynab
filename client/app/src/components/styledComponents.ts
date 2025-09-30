import styled from 'styled-components';
import breakpoints from '../../../shared/breakpoints';
import colors from '../../../shared/colors';
import zIndices from '../../../shared/zIndices';

export const FlexRow = styled.div`
  display: flex;
`;

export const FlexRowCenterAligned = styled(FlexRow)`
  align-items: center;
`;

export const FlexRowAllCentered = styled(FlexRowCenterAligned)`
  justify-content: center;
`;

export const FlexColumnAllCentered = styled(FlexRowAllCentered)`
  flex-direction: column;
`;

export const SectionHeader = styled.h1`
  font-size: 25px;
  margin: 0 0 35px 0;
  padding: 0;
  font-weight: 600;
  text-align: center;
`;

export const SectionTile = styled.section`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: calc(100% - 80px);
  max-width: 1290px;
  padding: 50px 75px;
  margin-bottom: 50px;
  border-radius: 3px;
  box-shadow: 0 1px 2px 0 #999, 0 -1px 4px 1px #ddd;
  background-color: white;

  @media (max-width: ${breakpoints.mobile}) {
    box-sizing: border-box;
    width: calc(100% - 20px);
    padding: 50px 30px;
  }

  @media (max-width: ${breakpoints.tiny}) {
    box-sizing: border-box;
    width: calc(100% - 20px);
    padding: 50px 10px;
  }
`;

export const RowOrColumn = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;

  @media (max-width: ${breakpoints.mobile}) {
    flex-direction: column;
    gap: 20px;
  }
`;

export const FormControlWrapper = styled.div`
  all: unset; // for use with as=fieldset
  width: 100%;
  margin-bottom: 40px;

  @media (max-width: ${breakpoints.mobile}) {
    margin-bottom: 50px;
  }
`;

export const LabelContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

export const Label = styled.label`
  margin-right: 5px;
`;

export const Paragraph = styled.p`
  all: unset;
  display: block;
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }
`;

// https://www.w3schools.com/howto/howto_css_loader.asp
export const Spinner = styled.div`
  border: 3px solid #eee;
  border-top: 3px solid #aaa;
  border-radius: 50%;
  width: 12px;
  height: 12px;
  animation: spin 2s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const OptionButton = styled.button<{ $selected: boolean }>`
  margin: 0 9px 9px 0;
  padding: 4px 9px;
  border: none;
  border-radius: 8px;
  box-shadow: 0 1px 0 0.5px #c9cdd2;
  color: #464b46;
  font-size: inherit;
  text-align: left;
  background-color: rgb(241, 241, 241);
  cursor: pointer;

  &:hover {
    background-color: #5183b1;
    color: white;
  }

  &:focus-visible {
    outline: 1px solid ${colors.buttonFocusOutline};
  }

  ${({ $selected }) =>
    $selected
      ? `
        background-color: #2f73b3;
        box-shadow: 0 1px 0 0.5px #395066;
        color: white;
        text-shadow: 0 0 2px #666;

        &:hover {
          background-color: #0061bd;
          color: white;
        }
      `
      : ''}
`;

export const SelectedOptionButton = styled(OptionButton)`
  background-color: #2f73b3;
  box-shadow: 0 1px 0 0.5px #395066;
  color: white;
  text-shadow: 0 0 2px #666;

  &:hover {
    background-color: #0061bd;
    color: white;
  }
`;

export const BackgroundOverlay = styled.div`
  position: fixed;
  z-index: ${zIndices.modalOverlay};
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  background-color: black;
  opacity: 50%;
`;

export const ScrollableArea = styled.div`
  overflow: auto;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  border-top: 1px solid ${colors.lightNeutralBg};
  border-bottom: 1px solid ${colors.lightNeutralBg};

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
