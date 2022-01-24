import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { OptionButton, SelectedOptionButton } from './styledComponents';

/* Styled Components */

const Container = styled.div``;

/* Main Component */

const AccountButtons = ({
  accounts,
  selectedAccounts,
  setSelectedAccounts,
}) => {
  const doesAccountHaveId = ({ accountId }, id) => (
    accountId === id
  );

  const selectAccount = (selection) => (
    setSelectedAccounts([...selectedAccounts, selection])
  );

  const deselectAccountById = (id) => (
    setSelectedAccounts(
      selectedAccounts.filter((account) => !doesAccountHaveId(account, id)),
    )
  );

  const toggleSharedAccount = ({
    id,
    name,
  }) => {
    if (selectedAccounts.find((account) => doesAccountHaveId(account, id))) {
      deselectAccountById(id);
    } else {
      selectAccount({ accountId: id, name });
    }
  };

  return (
    <Container>
      {
        accounts.map(({ name, id }) => {
          const isAccountSelected = selectedAccounts.find(
            (account) => doesAccountHaveId(account, id),
          );

          const Button = isAccountSelected
            ? SelectedOptionButton
            : OptionButton;

          return (
            <Button
              type="button"
              key={id}
              id={id}
              onClick={() => toggleSharedAccount({ id, name })}
            >
              {name}
            </Button>
          );
        })
      }
    </Container>
  );
};

AccountButtons.propTypes = {
  accounts: PropTypes.array.isRequired,
  selectedAccounts: PropTypes.array.isRequired,
  setSelectedAccounts: PropTypes.func.isRequired,
};

export default AccountButtons;
