import React from 'react';
import { string } from 'prop-types';
import { getUserData } from '../../utilities/http';

const AccountSelector = ({ username }) => {
  return (
    <>
      <p>What banking accounts in your YNAB budget are used for shared expenses?</p>
      {/*
        * Get list of all this user's banking accounts from YNAB
        * Map to a checkbox list
        * On save, add selected accounts to user's info in database
      */}
      <p>What budget categories in your YNAB budget are used for shared expenses?</p>
      {/*
        * Get list of all this user's budget categories from YNAB
        * Map to a checkbox list
        * On save, add selected categories to user's info in database
      */}
      <button type="button">Finish</button>
    </>
  );
};

AccountSelector.propTypes = {
  username: string.isRequired,
};

export default AccountSelector;
