import React from 'react';

const Instructions = () => {
  return (
    <ol className="description">
      <li>
        Create a
        <b>&nbsp;parent&nbsp;</b>
        category in your YNAB budget named &quot;Shared Expenses&quot;
      </li>
      <li>
        Add desired
        <b>&nbsp;sub-categories&nbsp;</b>
        underneath &quot;Shared Expenses&quot;&nbsp;
        (&quot;Shared Rent,&quot; &quot;Shared Groceries,&quot; etc.)
      </li>
      <li>
        Add an
        <b>&nbsp;IOU account in YNAB:&nbsp;</b>
        This account will track what your partner owes you for their half of the
        credit card debt.
        <ul>
          <li>
            Click
            <b>&nbsp;Add Account&nbsp;</b>
            in YNAB
          </li>
          <li>
            Select an account type of
            <b>&nbsp;Checking.&nbsp;</b>
            (or Cash - this doesn&apos;t matter so much)
          </li>
          <li>
            Nickname the account
            <b>
                  &nbsp;Owed from [
              <em>insert partner&apos;s name</em>
              ]&nbsp;
            </b>
          </li>
        </ul>
      </li>
      <li>
        Add the
        <b>&nbsp;shared credit card&nbsp;</b>
        as a YNAB account and sync it with your bank. Classify transactions
        to the shared expense categories you created earlier.
      </li>
      <li>
        Click
        <b>&nbsp;Start&nbsp;</b>
        below. You will need your YNAB credentials.
      </li>
      <li>
        The app will guide you through selecting your shared costs over a custom date range.
        Then it will create a single transaction
        <b>&nbsp;removing half the costs from your expenses,&nbsp;</b>
        and
        <b>
              &nbsp;adding the same amount to the IOU account you created,&nbsp;
        </b>
        reflecting the balance your partner owes you.
        You&apos;ll be able to see the transaction in YNAB,
        and delete or edit it at will.
      </li>
      <li>
        When your partner pays you back the balance, add a
        <b>&nbsp;transfer&nbsp;</b>
        transaction from the IOU account to the real bank or cash account where you
        deposited the money.
      </li>
    </ol>
  );
};

export default Instructions;
