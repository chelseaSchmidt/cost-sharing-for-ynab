import styled from 'styled-components';
import colors from './colors';

const StyledButton = styled.button`
  all: unset;
  cursor: pointer;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  box-shadow: 0 1px 2px 0 #666;
  padding: 12px 24px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: white;
  text-decoration: none;
  text-align: center;
  letter-spacing: 0.5px;

  background: ${colors.primary};

  &:hover {
    background: ${colors.lightNeutralAccent};
  }

  &:active {
    background: ${colors.buttonActive};
  }

  &:disabled {
    background: #999;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${colors.buttonFocusOutline};
  }
`;

const RestyledButton = styled(Button)``;

export interface ButtonProps extends React.ComponentProps<'button'> {
  asLink?: boolean;
  external?: boolean;
  styledComponent?: typeof StyledButton | typeof RestyledButton;
}

export default function Button({
  asLink = false,
  external = false,
  styledComponent,
  ...props
}: ButtonProps) {
  const externalProps = asLink && external ? { target: '_blank', rel: 'noreferrer' } : {};

  return (
    <StyledButton
      type={asLink ? undefined : 'button'}
      as={asLink ? 'a' : styledComponent}
      {...externalProps}
      {...props}
    />
  );
}
