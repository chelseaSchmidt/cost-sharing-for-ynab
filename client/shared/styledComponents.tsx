import styled from 'styled-components';
import colors from './colors';

export const Hyperlink = styled.a`
  all: unset;

  text-align: left;
  padding: 0;
  margin: 0 10px;
  cursor: pointer;
  text-decoration: underline;
  color: #464b46;

  &:hover,
  &:visited:hover {
    color: blue;
  }

  &:visited {
    color: #464b46;
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
