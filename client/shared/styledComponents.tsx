import styled from 'styled-components';

export const Hyperlink = styled.a`
  all: unset;

  text-align: left;
  padding: 0;
  margin: 0 10px;
  cursor: pointer;
  text-decoration: underline;
  color: #464b46;
  font-size: 12px;

  &:hover,
  &:visited:hover {
    color: blue;
  }

  &:visited {
    color: #464b46;
  }

  &:focus-visible {
    outline: 1px solid blue;
    border-radius: 5px;
  }
`;
