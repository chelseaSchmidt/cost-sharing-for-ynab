import React from 'react';
import { arrayOf, objectOf, string } from 'prop-types';
import { getUserData } from '../../utilities/http';
import '../styles/AccountSelector.css';

const AccountSelector = ({ userData }) => {
  console.log(userData);
  // cross reference YNAB data with stored user data from this app
  // <AccountSelector /> should show saved selections (GET) & allow new selections (PATCH)
  return (
    <>
      <p>What banking accounts in your YNAB budget are used for shared expenses?</p>
      {userData.budgetAccounts.map(({ name, id }) => (
        <button
          type="button"
          id={id}
          className="acct-btn"
          key={id}
        >
          {name}
        </button>
      ))}
      {/*
        * Get list of all this user's banking accounts from YNAB
        * Map to buttons
        * On save, add selected accounts to user's info in database
      */}
      <p>What budget categories in your YNAB budget are used for shared expenses?</p>
      {userData.budgetCategories.map(({ name, id }) => (
        <button
          type="button"
          id={id}
          className="cat-btn"
          key={id}
        >
          {name}
        </button>
      ))}
      {/*
        * Get list of all this user's budget categories from YNAB
        * Map to buttons
        * On save, add selected categories to user's info in database
      */}
      <div />
      <button type="button" id="save-btn">Save</button>
    </>
  );
};

AccountSelector.propTypes = {
  userData: objectOf(arrayOf(objectOf(string))).isRequired,
};

export default AccountSelector;
