import React, { useState, useEffect } from 'react';
import {
  arrayOf,
  objectOf,
  string,
  func,
  shape,
} from 'prop-types';
import '../styles/AccountSelector.css';

const AccountSelector = ({ userData, budgetData, setUserData }) => {
  const [sharedAccounts, setSharedAccounts] = useState(userData.sharedAccounts);
  const [sharedCategories, setSharedCategories] = useState(userData.sharedCategories);
  const [splitAccount, setSplitAccount] = useState(userData.splitAccount);
  const budgetAccounts = [...budgetData.budgetAccounts];
  const budgetCategories = [...budgetData.budgetCategories];

  useEffect(() => {
    setSharedAccounts(userData.sharedAccounts);
  }, [userData.sharedAccounts]);

  useEffect(() => {
    setSharedCategories(userData.sharedCategories);
  }, [userData.sharedCategories]);

  useEffect(() => {
    setSplitAccount(userData.splitAccount);
  }, [userData.splitAccount]);

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
    if (sharedCategories.filter((cat) => cat.categoryId === id).length) {
      const copyCats = sharedCategories.filter((cat) => cat.categoryId !== id);
      setSharedCategories(copyCats);
    } else {
      const subCategories = budgetCategories
        .filter((catGroup) => catGroup.id === id)
        .map((catGroup) => catGroup.categories)[0];
      const copyCats = [...sharedCategories];
      copyCats.push({ name: innerHTML, categoryId: id, subCategories });
      setSharedCategories(copyCats);
    }
  }

  function save() {
    setUserData({
      sharedAccounts,
      sharedCategories,
      splitAccount,
    });
  }

  return (
    <div id="account-selector-container" className="section-container">
      <div id="account-selector-area">
        <div id="bank-tags">
          <p>
            Select one or more banking accounts that contain shared expenses, such as a credit card that you share with a significant other or roommate.
          </p>
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
          <p>
            Select one or more category groups where you track shared expenses before splitting them with the other person.
          </p>
          <div className="tag-area">
            {budgetCategories.map(({ name, id }) => {
              let toggleClass = 'cat-btn';
              if (sharedCategories.map((cat) => cat.categoryId).indexOf(id) > -1) {
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
          <p>
            Select the banking account where you track what is owed back to you by the other person.
          </p>
          <select
            onChange={(e) => setSplitAccount(e.target.value)}
            defaultValue="select-an-account"
            id="split-acct-dropdown"
          >
            <option value="select-an-account">
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
      <button
        type="button"
        id="save-btn"
        className="update-btn"
        onClick={save}
      >
        Save
      </button>
  </div>
  );
};

AccountSelector.propTypes = {
  userData: shape({
    sharedAccounts: arrayOf(objectOf(string)),
    sharedCategories: arrayOf(shape({
      name: string,
      categoryId: string,
      subCategories: arrayOf(shape({
        id: string,
      })),
    })),
    splitAccount: string,
  }).isRequired,
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
  setUserData: func.isRequired,
};

export default AccountSelector;
