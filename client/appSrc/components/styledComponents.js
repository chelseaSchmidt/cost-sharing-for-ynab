import styled from 'styled-components';

export const SectionHeader = styled.h1`
  font-size: 25px;
  margin: 0 0 35px 0;
  padding: 0;
  font-weight: 600;
  text-align: center;
`;

export const BaseButton = styled.button`
  background-color: #11518c;
  color: white;
  border-radius: 8px;
  font-size: 14px;
  border: 1px solid white;
  box-shadow: 0 1px 2px 0 #515852;
  padding: 8px 15px;
  font-weight: 400;
  cursor: pointer;

  :hover {
    background-color: lightgray;
  }

  :focus {
    outline: none;
  }

  :disabled {
    background-color: gray;
    cursor: not-allowed;
  }
`;

const hyperlinkStyle = `
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  text-rendering: unset;
  align-items: unset;
  font: unset;
  box-sizing: unset;
  writing-mode: unset;
  -webkit-writing-mode: unset;
  letter-spacing: unset;
  word-spacing: unset;
  text-transform: unset;
  text-indent: unset;
  text-shadow: unset;
  display: unset;
  background: none;
  border: none;

  text-align: left;
  padding: 0;
  margin: 0 10px;
  cursor: pointer;
  text-decoration: underline;
  color: #464b46;
  font-size: 12px;

  :hover, :visited:hover {
    color: blue;
  }

  :visited {
    color: #464b46;
  }
`;

export const LinkishButton = styled.button`
  ${hyperlinkStyle}
`;

export const Hyperlink = styled.a`
  ${hyperlinkStyle}
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

  :hover {
    > * {
      visibility: visible;
    }
  }
`;

export const Tooltip = styled.span`
  visibility: hidden;
  z-index: 1;

  position: absolute;
  bottom: 100%;
  right: 0;
  width: 170px;

  background-color: #444;
  color: white;
  font-size: 11px;
  font-weight: normal;
  text-align: center;
  padding: 5px;
  border-radius: 5px;
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
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const OptionButton = styled.button`
  margin: 0 9px 9px 0;
  padding: 4px 9px;
  border: none;
  border-radius: 8px;
  box-shadow: 0 1px 0 0.5px #c9cdd2;
  color: #464b46;
  font-size: 13px;
  background-color: rgb(241, 241, 241);
  cursor: pointer;

  :hover {
    background-color: #5183b1;
    color: white;
  }

  :focus {
    outline: none;
  }
`;

export const SelectedOptionButton = styled(OptionButton)`
  background-color: #2f73b3;
  box-shadow: 0 1px 0 0.5px #395066;
  color: white;
  text-shadow: 0 0 2px #666;

  :hover {
    background-color: #0061bd;
    color: white;
  }
`;

export const BackgroundOverlay = styled.div`
  position: fixed;
  z-index: 5;
  top: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  background-color: black;
  opacity: 50%;
`;
