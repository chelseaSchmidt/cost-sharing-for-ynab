import React, { useState, useEffect } from 'react';
import { arrayOf, objectOf, string, func } from 'prop-types';
import { getUserData, updateUserData } from '../../utilities/http';
import '../styles/AccountSelector.css';

const AccountSelector = ({ userData, setUserData, username }) => {
  const [sharedAccounts, setSharedAccounts] = useState(userData.sharedAccounts);
  const [sharedCategories, setSharedCategories] = useState(userData.sharedCategories);
  const budgetAccounts = [...userData.budgetAccounts];
  const budgetCategories = [...userData.budgetCategories];

  useEffect(() => {
    setSharedAccounts(userData.sharedAccounts);
  }, [userData.sharedAccounts]);

  useEffect(() => {
    setSharedCategories(userData.sharedCategories);
  }, [userData.sharedCategories]);

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
      const copyCats = [...sharedCategories];
      copyCats.push({ name: innerHTML, categoryId: id });
      setSharedCategories(copyCats);
    }
  }

  function save() {
    updateUserData(username, sharedAccounts, sharedCategories);
    setUserData({
      budgetAccounts,
      budgetCategories,
      sharedAccounts,
      sharedCategories,
    });
  }

  return (
    <>
      <p>What banking accounts in your YNAB budget are used for shared expenses?</p>
      {userData.budgetAccounts.map(({ name, id }) => {
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
      )})}
      <p>What budget categories in your YNAB budget are used for shared expenses?</p>
      {userData.budgetCategories.map(({ name, id }) => {
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
      )})}
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
  userData: objectOf(arrayOf(objectOf(string))).isRequired,
  setUserData: func.isRequired,
  username: string.isRequired,
};

export default AccountSelector;
