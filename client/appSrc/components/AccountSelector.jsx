import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { SectionHeader } from './styledComponents';

/* Styled Components */

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 12px;
  width: 100%;
`;

const SectionContent = styled.div`
  margin-bottom: 40px;
`;

const Subtitle = styled.p`
  font-weight: bold;
  margin-bottom: 20px;
`;

const ButtonsContainer = styled.div``;

const OptionButton = styled.button`
  margin: 0 9px 9px 0;
  padding: 4px 9px;
  border: none;
  border-radius: 8px;
  box-shadow: 0 1px 0 0.5px #c9cdd2;
  color: #464b46;
  font-size: 13px;
  background-color: rgb(241, 241, 241);
  cursor: pointer;

  :hover {
    background-color: #5183b1;
    color: white;
  }

  :focus {
    outline: none;
  }
`;

const SelectedOptionButton = styled(OptionButton)`
  background-color: #2f73b3;
  box-shadow: 0 1px 0 0.5px #395066;
  color: white;
  text-shadow: 0 0 2px #666;

  :hover {
    background-color: #0061bd;
    color: white;
  }
`;

const IouAccountSelectorContainer = styled.div``;

const IouAccountSelector = styled.select`
  cursor: pointer;

  :focus {
    outline: none;
  }
`;

/* Main Component */

const AccountSelector = ({
  budgetData: {
    accounts: budgetAccounts,
    categoryGroups: budgetParentCategories,
  },
  sharedAccounts,
  sharedParentCategories,
  setSharedAccounts,
  setSharedParentCategories,
  setSplitAccountId,
}) => {
  const doesAccountHaveId = ({ accountId }, id) => (
    accountId === id
  );

  const selectAccount = (selection) => (
    setSharedAccounts([...sharedAccounts, selection])
  );

  const deselectAccountById = (id) => (
    setSharedAccounts(
      sharedAccounts.filter((account) => !doesAccountHaveId(account, id)),
    )
  );

  const doesCategoryHaveId = ({ categoryId }, id) => (
    categoryId === id
  );

  const selectCategory = (selection) => (
    setSharedParentCategories([...sharedParentCategories, selection])
  );

  const deselectCategoryById = (id) => (
    setSharedParentCategories(
      sharedParentCategories.filter((category) => !doesCategoryHaveId(category, id)),
    )
  );

  const toggleSharedAccount = ({
    id,
    name,
  }) => {
    if (sharedAccounts.find((account) => doesAccountHaveId(account, id))) {
      deselectAccountById(id);
    } else {
      selectAccount({ accountId: id, name });
    }
  };

  const toggleSharedCategory = ({
    id,
    name,
    subCategories,
  }) => {
    if (sharedParentCategories.find((category) => doesCategoryHaveId(category, id))) {
      deselectCategoryById(id);
    } else {
      selectCategory({ name, categoryId: id, subCategories });
    }
  };

  const hiddenCategoryNames = [
    'Internal Master Category',
    'Credit Card Payments',
    'Hidden Categories',
  ];

  return (
    <Container>
      <SectionHeader>Choose Accounts and Categories</SectionHeader>

      <SectionContent>
        <Subtitle>Select the credit card(s) you use for shared expenses</Subtitle>

        <ButtonsContainer>
          {
            budgetAccounts.map(({ name, id }) => {
              const isAccountSelected = sharedAccounts.find(
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
        </ButtonsContainer>
      </SectionContent>

      <SectionContent>
        <Subtitle>Select the YNAB parent category(ies) where you track shared expenses</Subtitle>

        <ButtonsContainer>
          {
            budgetParentCategories.map(({
              name,
              id,
              categories: subCategories,
            }) => {
              const shouldDisplayCategory = !hiddenCategoryNames.includes(name);

              if (shouldDisplayCategory) {
                const isCategorySelected = sharedParentCategories.find(
                  (category) => doesCategoryHaveId(category, id),
                );

                const Button = isCategorySelected
                  ? SelectedOptionButton
                  : OptionButton;

                return (
                  <Button
                    type="button"
                    key={id}
                    id={id}
                    onClick={() => toggleSharedCategory({ id, name, subCategories })}
                  >
                    {name}
                  </Button>
                );
              }

              return null;
            })
          }
        </ButtonsContainer>
      </SectionContent>

      <SectionContent>
        <Subtitle>
          Select the &quot;IOU&quot; account that shows what your partner owes you
        </Subtitle>

        <IouAccountSelectorContainer>
          <IouAccountSelector
            onChange={(e) => setSplitAccountId(e.target.value)}
            defaultValue="none"
          >
            <option disabled value="none">
              -- select an account --
            </option>

            {
              budgetAccounts.map(({ name, id }) => (
                <option
                  id={`iou-${id}`}
                  key={`iou-${id}`}
                  value={id}
                >
                  {name}
                </option>
              ))
            }
          </IouAccountSelector>
        </IouAccountSelectorContainer>
      </SectionContent>
    </Container>
  );
};

AccountSelector.propTypes = {
  sharedAccounts: PropTypes.array.isRequired,
  sharedParentCategories: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      categoryId: PropTypes.string,
      subCategories: PropTypes.array,
    }),
  ).isRequired,
  budgetData: PropTypes.shape({
    accounts: PropTypes.array,
    categoryGroups: PropTypes.array,
    budgetCategories: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        id: PropTypes.string,
        categories: PropTypes.array,
      }),
    ),
  }).isRequired,
  setSharedAccounts: PropTypes.func.isRequired,
  setSharedParentCategories: PropTypes.func.isRequired,
  setSplitAccountId: PropTypes.func.isRequired,
};

export default AccountSelector;
