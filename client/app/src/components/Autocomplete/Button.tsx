import { ButtonHTMLAttributes, ReactNode } from 'react';
import styled from 'styled-components';

export const StyledButton = styled.button`
  all: unset;
  box-sizing: border-box;
  display: inline-block;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
  }

  &:focus-visible {
    border: 1px solid blue;
  }
`;

const RestyledButton = styled(StyledButton);

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  styledContainer?: typeof StyledButton | typeof RestyledButton;
};

export default function Button({ styledContainer, ...props }: Props) {
  return <StyledButton type="button" {...props} as={styledContainer} />;
}
