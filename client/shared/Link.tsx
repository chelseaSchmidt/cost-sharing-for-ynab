import styled from 'styled-components';
import colors from './colors';

type Theme = 'default' | 'subtle';

export const Hyperlink = styled.a<{ $theme: Theme }>`
  --link-color: ${({ $theme }) => ($theme === 'subtle' ? colors.defaultFont : colors.primary)};
  --hover-color: ${({ $theme }) => ($theme === 'subtle' ? colors.primary : colors.linkHover)};

  all: unset;
  cursor: pointer;
  text-decoration: underline;
  color: var(--link-color);

  &:hover,
  &:visited:hover {
    color: var(--hover-color);
  }

  &:visited {
    color: var(--link-color);
  }

  &:focus-visible {
    outline: 1px solid ${colors.primary};
    border-radius: 5px;
  }
`;

const StyledHyperlink = styled(Hyperlink);

interface Props extends React.ComponentProps<'a'> {
  asButton?: boolean;
  internal?: boolean;
  theme?: Theme;
  styledComponent?: typeof Hyperlink | typeof StyledHyperlink;
}

export default function Link({
  asButton = false,
  internal = false,
  theme = 'default',
  styledComponent,
  ...props
}: Props) {
  const defaultProps = asButton
    ? { as: 'button', type: 'button' }
    : internal
    ? {}
    : { target: '_blank', rel: 'noreferrer' };

  return <Hyperlink as={styledComponent} $theme={theme} {...defaultProps} {...props} />;
}
