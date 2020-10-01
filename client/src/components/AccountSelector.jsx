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
    <>
      <p>What banking accounts in your YNAB budget are used for shared expenses?</p>
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
      <p>What Category Groups in your YNAB budget are used for shared expenses?</p>
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
      <p>What banking account in your YNAB budget should receive the split transaction?</p>
      <select
        onChange={(e) => setSplitAccount(e.target.value)}
        defaultValue="select-an-account"
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
      <div />
      <button
        type="button"
        id="save-btn"
        onClick={save}
      >
        Save
      </button>
    </>
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
