import styled from 'styled-components';
import breakpoints from '../../../shared/breakpoints';
import colors from '../../../shared/colors';
import Autocomplete, { AutocompleteProps } from './Autocomplete';

/* STYLED COMPONENTS */

const InputWrapper = styled.div`
  border: 1px solid ${colors.lightNeutralAccent};
  border-radius: 5px;
  padding: 5px;

  &:focus-within {
    outline: 1px solid ${colors.primary};
  }

  input {
    outline: none;
  }

  button {
    border: none;
    margin-left: 5px;
    border-radius: 5px;

    &:hover {
      background: ${colors.primary};
    }

    &:disabled {
      background: none;
    }
  }
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  border: 1px solid ${colors.lightNeutralAccent};
  border-radius: 5px;
  background: white;
`;

const ListItem = styled.li`
  padding: 5px;
`;

const SelectedInputPill = styled.div`
  border: none;
  box-sizing: border-box;
  padding: 5px 10px;
  border-radius: 5px;
  max-width: 250px;
  background: ${colors.primaryLight};

  button {
    margin-left: 5px;
    border-radius: 5px;

    &:hover {
      background: ${colors.primary};
    }
  }

  @media (max-width: ${breakpoints.mobile}) {
    max-width: 200px;
  }

  @media (max-width: ${breakpoints.tiny}) {
    max-width: 150px;
  }
`;

/* MAIN */

export default function BudgetAutocomplete<T>(props: AutocompleteProps<T>) {
  return (
    <Autocomplete
      disabledItemStyle={{ background: 'white' }}
      selectedItemStyle={{
        background: colors.primaryLight,
        color: 'inherit',
        '&:hover': { background: colors.primary, color: 'white' },
      }}
      deleteIconLineStyle={{
        background: colors.primary,
        '&:hover': { background: 'white' },
        '&:disabled': { background: colors.lightNeutralAccent },
      }}
      styledComponents={{
        InputWrapper,
        List,
        ListItem,
        SelectedInputPill,
      }}
      {...props}
    />
  );
}
