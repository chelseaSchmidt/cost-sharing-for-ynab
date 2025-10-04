import range from 'lodash/range';
import styled from 'styled-components';
import breakpoints from '../../../shared/breakpoints';
import Button from '../../../shared/Button';
import colors from '../../../shared/colors';
import { headerBreakpoints } from '../constants';

const StyledButton = styled(Button)`
  box-sizing: unset;
  box-shadow: unset;
  background: unset;

  --default-size: 30px;
  --mobile-size: 22px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: var(--default-size);
  padding: 20px;

  div {
    height: 5px;
    width: var(--default-size);
  }

  @media (max-width: ${breakpoints.mobile}) {
    height: var(--mobile-size);
    padding: 10px;

    div {
      height: 4px;
      width: var(--mobile-size);
    }
  }

  @media (max-width: ${headerBreakpoints.xxs}) {
    padding: 5px;
  }

  &:hover {
    div {
      background: ${colors.primary};
    }
  }
`;

const IconBar = styled.div`
  background: white;
  border-radius: 5px;
`;

interface Props {
  toggleMenu: () => void;
  isMenuOpen: boolean;
}

export default function IconButton({ toggleMenu, isMenuOpen }: Props) {
  return (
    <StyledButton onClick={toggleMenu} aria-label="Open menu" inert={isMenuOpen}>
      {range(0, 3).map((bar) => (
        <IconBar key={bar} />
      ))}
    </StyledButton>
  );
}
