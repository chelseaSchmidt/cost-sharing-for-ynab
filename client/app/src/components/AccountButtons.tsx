import styled from 'styled-components';
import { OptionButton, SelectedOptionButton } from './styledComponents';
import { Account } from '../types';

/* Styled Components */

const Container = styled.div``;

/* Main Component */

interface Props {
  accounts: Account[];
  selectedAccounts: Account[];
  setSelectedAccounts: (selected: Account[]) => void;
}

const AccountButtons = ({ accounts, selectedAccounts, setSelectedAccounts }: Props) => {
  const doesAccountHaveId = (account: Account, id: string | number) => account.id === id;

  const selectAccount = (selection: Account) =>
    setSelectedAccounts([...selectedAccounts, selection]);

  const deselectAccountById = (id: string | number) =>
    setSelectedAccounts(selectedAccounts.filter((account) => !doesAccountHaveId(account, id)));

  const toggleSharedAccount = ({ id, name }: Account) => {
    if (selectedAccounts.find((account) => doesAccountHaveId(account, id))) {
      deselectAccountById(id);
    } else {
      selectAccount({ id, name });
    }
  };

  return (
    <Container>
      {accounts.map(({ name, id }: Account) => {
        const isAccountSelected = selectedAccounts.find((account) =>
          doesAccountHaveId(account, id),
        );

        const Button = isAccountSelected ? SelectedOptionButton : OptionButton;

        return (
          <Button
            type="button"
            key={id}
            id={String(id)}
            onClick={() => toggleSharedAccount({ id, name })}
          >
            {name}
          </Button>
        );
      })}
    </Container>
  );
};

export default AccountButtons;
