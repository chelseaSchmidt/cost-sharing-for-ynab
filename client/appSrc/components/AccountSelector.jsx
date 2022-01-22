import React from 'react';
import PropTypes from 'prop-types';
import '../styles/AccountSelector.css';
import { SectionHeader } from './styledComponents';

const AccountSelector = ({
  budgetData,
  sharedAccounts,
  sharedParentCategories,
  setSharedAccounts,
  setSharedParentCategories,
  setSplitAccountId,
}) => {
  const budgetAccounts = [...budgetData.accounts];
  const budgetCategories = [...budgetData.categoryGroups];

  const selectAccount = (e) => {
    const { target: { id, innerHTML } } = e;

    if (sharedAccounts.filter((acct) => acct.accountId === id).length) {
      const copyAccounts = sharedAccounts.filter((acct) => acct.accountId !== id);
      setSharedAccounts(copyAccounts);
    } else {
      const copyAccounts = [...sharedAccounts];
      copyAccounts.push({ name: innerHTML, accountId: id });
      setSharedAccounts(copyAccounts);
    }
  };

  const selectCategory = ({ target: { id, innerHTML } }) => {
    if (sharedParentCategories.filter((cat) => cat.categoryId === id).length) {
      const copyCats = sharedParentCategories.filter((cat) => cat.categoryId !== id);
      setSharedParentCategories(copyCats);
    } else {
      const subCategories = budgetCategories
        .filter((catGroup) => catGroup.id === id)
        .map((catGroup) => catGroup.categories)[0];
      const copyCats = [...sharedParentCategories];
      copyCats.push({ name: innerHTML, categoryId: id, subCategories });
      setSharedParentCategories(copyCats);
    }
  };

  const excludedCategories = [
    'Internal Master Category',
    'Credit Card Payments',
    'Hidden Categories',
  ];

  return (
    <div id="account-selector-container">
      <div id="account-selector-area">
        <div id="bank-tags">
          <SectionHeader>Choose Accounts and Categories</SectionHeader>
          <p><b>Select the credit card(s) you use for shared expenses</b></p>
          <div className="tag-area">
            {budgetAccounts.map(({ name, id }) => {
              let toggleClass = 'acct-btn';
              if (sharedAccounts.map((acct) => acct.accountId).indexOf(id) > -1) {
                toggleClass += ' active-btn';
              }
              return (
                <button
                  type="button"
                  id={id}
                  className={toggleClass}
                  onClick={selectAccount}
                  key={id}
                >
                  {name}
                </button>
              );
            })}
          </div>
        </div>
        <div id="cat-tags">
          <p><b>Select the YNAB parent category(ies) where you track shared expenses</b></p>
          <div className="tag-area">
            {budgetCategories.map(({ name, id }) => {
              if (excludedCategories.indexOf(name) > -1) {
                return <span key={id} />;
              }
              let toggleClass = 'cat-btn';
              if (sharedParentCategories.map((cat) => cat.categoryId).indexOf(id) > -1) {
                toggleClass += ' active-btn';
              }
              return (
                <button
                  type="button"
                  id={id}
                  className={toggleClass}
                  onClick={selectCategory}
                  key={id}
                >
                  {name}
                </button>
              );
            })}
          </div>
        </div>
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
              {budgetAccounts.map(({ name, id }) => (
                <option
                  id={`split-${id}`}
                  key={`split-${id}`}
                  value={id}
                >
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
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
