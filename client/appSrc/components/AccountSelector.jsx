import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import styled from 'styled-components';
import '../styles/AccountSelector.css';
import { SectionHeader } from './styledComponents';

/* Styled Components */

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 12px;
  width: 100%;
`;

// FIXME: not a very good name
const ButtonsContainer = styled.div`
  margin-bottom: 40px;

  p {
    margin-bottom: 20px;
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
  const toggleSharedAccount = ({
    id,
    name,
  }) => {
    const doesAccountHaveId = ({ accountId }) => accountId === id;

    const selectAccount = () => {
      setSharedAccounts([...sharedAccounts, { name, accountId: id }]);
    };

    const deselectAccount = () => {
      setSharedAccounts(sharedAccounts.filter(_.negate(doesAccountHaveId)));
    };

    if (sharedAccounts.find(doesAccountHaveId)) {
      deselectAccount();
    } else {
      selectAccount();
    }
  };

  const toggleSharedCategory = ({
    id,
    name,
    subCategories,
  }) => {
    const doesCategoryHaveId = ({ categoryId }) => categoryId === id;

    const selectCategory = () => {
      setSharedParentCategories([
        ...sharedParentCategories,
        { name, categoryId: id, subCategories },
      ]);
    };

    const deselectCategory = () => {
      setSharedParentCategories(sharedParentCategories.filter(_.negate(doesCategoryHaveId)));
    };

    if (sharedParentCategories.find(doesCategoryHaveId)) {
      deselectCategory();
    } else {
      selectCategory();
    }
  };

  const hiddenCategoryNames = [
    'Internal Master Category',
    'Credit Card Payments',
    'Hidden Categories',
  ];

  return (
    <Container>
      <ButtonsContainer>
        <SectionHeader>Choose Accounts and Categories</SectionHeader>

        <p><b>Select the credit card(s) you use for shared expenses</b></p>

        <div className="tag-area">
          {
            budgetAccounts.map(({ name, id }) => {
              let classNamesString = 'acct-btn';

              if (sharedAccounts.find(({ accountId }) => accountId === id)) {
                classNamesString += ' active-btn';
              }

              return (
                <button
                  type="button"
                  key={id}
                  id={id}
                  className={classNamesString}
                  onClick={() => toggleSharedAccount({ id, name })}
                >
                  {name}
                </button>
              );
            })
          }
        </div>
      </ButtonsContainer>
      <ButtonsContainer>
        <p><b>Select the YNAB parent category(ies) where you track shared expenses</b></p>
        <div className="tag-area">
          {
            budgetParentCategories.map(({
              name,
              id,
              categories: subCategories,
            }) => {
              if (!hiddenCategoryNames.includes(name)) {
                let classNamesString = 'cat-btn';

                if (sharedParentCategories.find(({ categoryId }) => categoryId === id)) {
                  classNamesString += ' active-btn';
                }

                return (
                  <button
                    type="button"
                    id={id}
                    className={classNamesString}
                    onClick={() => toggleSharedCategory({ id, name, subCategories })}
                    key={id}
                  >
                    {name}
                  </button>
                );
              }
              return null;
            })
          }
        </div>
      </ButtonsContainer>
      <div id="split-option-area">
        <p>
          <b>
            Select the &quot;IOU&quot; account that shows what your partner owes you
          </b>
        </p>

        <div id="split-acct-dropdown">
          <select
            onChange={(e) => setSplitAccountId(e.target.value)}
            defaultValue="select-an-account"
          >
            <option disabled value="select-an-account">
              -- select an account --
            </option>

            {
              budgetAccounts.map(({ name, id }) => (
                <option
                  id={`split-${id}`}
                  key={`split-${id}`}
                  value={id}
                >
                  {name}
                </option>
              ))
            }
          </select>
        </div>
      </div>
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
