import React from 'react';
import {
  arrayOf,
  objectOf,
  string,
  func,
  shape,
} from 'prop-types';
import '../styles/AccountSelector.css';

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

  function addAccount({ target: { id, innerHTML } }) {
    if (sharedAccounts.filter((acct) => acct.accountId === id).length) {
      const copyAccounts = sharedAccounts.filter((acct) => acct.accountId !== id);
      setSharedAccounts(copyAccounts);
    } else {
      const copyAccounts = [...sharedAccounts];
      copyAccounts.push({ name: innerHTML, accountId: id });
      setSharedAccounts(copyAccounts);
    }
  }

  function addCategory({ target: { id, innerHTML } }) {
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
  }

  const excludedCategories = [
    'Internal Master Category',
    'Credit Card Payments',
    'Hidden Categories',
  ];

  return (
    <div id="account-selector-container">
      <div id="account-selector-area">
        <div id="bank-tags">
          <h1 className="section-header">Choose Accounts and Categories</h1>
          <p><b>Select all shared credit cards and bank accounts</b></p>
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
                  onClick={addAccount}
                  key={id}
                >
                  {name}
                </button>
              );
            })}
          </div>
        </div>
        <div id="cat-tags">
          <p><b>Select all category groups that contain shared expenses</b></p>
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
                  onClick={addCategory}
                  key={id}
                >
                  {name}
                </button>
              );
            })}
          </div>
        </div>
        <div id="split-option-area">
          <p><b>Select your IOU account</b></p>
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
  sharedAccounts: arrayOf(objectOf(string)).isRequired,
  sharedParentCategories: arrayOf(shape({
    name: string,
    categoryId: string,
    subCategories: arrayOf(shape({
      id: string,
    })),
  })).isRequired,
  budgetData: shape({
    budgetAccounts: arrayOf(objectOf(string)),
    budgetCategories: arrayOf(shape({
      name: string,
      id: string,
      categories: arrayOf(shape({
        id: string,
      })),
    })),
  }).isRequired,
  setSharedAccounts: func.isRequired,
  setSharedParentCategories: func.isRequired,
  setSplitAccountId: func.isRequired,
};

export default AccountSelector;
