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

export const LinkishButton = styled.button`
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
