import styled from 'styled-components';
import colors from '../../../shared/colors';
import zIndices from '../../../shared/zIndices';

export const SectionHeader = styled.h1`
  font-size: 25px;
  margin: 0 0 35px 0;
  padding: 0;
  font-weight: 600;
  text-align: center;
`;

export const WarningIcon = styled.span`
  display: flex;
  position: relative;
  box-sizing: border-box;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  height: 15px;
  width: 15px;
  min-width: 15px;
  border: 1px solid red;
  font-size: 8px;
  color: red;
  font-weight: bold;
  margin: 0 5px;

  &:hover {
    > * {
      visibility: visible;
    }
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
