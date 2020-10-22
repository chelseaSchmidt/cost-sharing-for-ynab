import React from 'react';
import PrivacyPolicy from '../../src/components/PrivacyPolicy';
import Header from '../../src/components/Header';
import '../styles/Home.css';

const Home = () => {
  const url = window.location.href;
  const appEndpoint = 'cost-sharer';
  return (
    <div>
      <Header setPrivacyActive={() => {}} url={url} appEndpoint={appEndpoint} />
      <div id="content-container" className="column">
        <p className="description tagline">
          Split shared expenses 50/50 with another person (signficant other, roommate, etc.) while keeping track of the original expense breakdown.
        </p>
        <div className="divider" />
        <div className="subtitle">WHY USE THIS APP?</div>
        <p className="description">
          To help you understand why you might use this app, I'll walk through a use case - my own! My partner and I use a shared credit card for all our communal expenses, such as utilities, groceries, gas, and restaurants. Since the credit card is in my name and syncing to my YNAB account, I track 100% of the shared card's expenses in my own YNAB budget during the month, and then at the end of the month my partner pays me back 50%. During the month I record transactions to their respective expense categories contained under one overarching category group called "Shared Expenses," like this:
        </p>
        <img
          src="YNAB-shared-categories.png"
          alt="Screenshot of 'Shared Expenses' category group and sub-categories"
          width="189px"
          height="432px"
        />
        <p className="description">
          At the end of each month, I credit half of all those expenses back to my partner in an IOU account from him to me, and he pays me back that amount (or we just keep a running tab open).
        </p>
        <p className="description">
          This is simple enough to do in YNAB if you're not interested in keeping track of the original expense categories for each shared cost - you could just track everything in one category called "shared costs" and then charge half to the IOU account each month. On the other hand, you could lose a lot of visibility into your spending trends over time.
        </p>
        <p className="description">
          My personal preference is to track all incoming shared costs by different categories, and to charge back half of those costs separated by category as well, to accurately portray what I'm really spending each month. As you can imagine, this can be a pain when you have a lot of shared cost categories to keep track of. That's where Cost Sharing for YNAB comes in!
        </p>
        <div className="divider" />
        <div className="subtitle">INSTRUCTIONS</div>
        <ol className="description">
          <li>
            Open the app by selecting the link below, or in the menu at the top right of the screen. You will be redirected to a YNAB authorization screen to enter your credentials.
          </li>
          <li>
            Optional: select one or more banking accounts in YNAB that you use for shared costs, such as a shared credit card, if your situation is similar to the example above. If you don't use any one account specifically for shared costs, don't worry about this step.
          </li>
          <li>
            Select one or more category <em>groups</em> that contain shared-cost budget categories. Individual categories cannot be selected at this time, only entire groups.
          </li>
          <li>
            Select a YNAB account you want to use as an IOU account representing what the other person owes back to you.
          </li>
          <li>
            Select a date range over which you want to view transactions.
          </li>
          <li>
            After hitting "Show Transactions," you will see a list of all your YNAB transactions in the budget categories and banking accounts you designated, over the specified time period.
          </li>
          <li>
            If you selected one or more shared banking accounts, the app will shows yellow warning symbols if a transaction has been included in a shared budget category but isn't present in the shared banking account, or vice versa. These can be ignored if you don't use a specific credit card or banking account for your shared expenses.
          </li>
          <li>
            Select all or some of the shared cost transactions, and hit a button to automatically create a transaction in your YNAB budget splitting the costs with the IOU account. A single summary transaction will be created in your YNAB budget that moves half the amount from each budget category to the IOU account.
          </li>
        </ol>
        <a href={`https://app.youneedabudget.com/oauth/authorize?client_id=4ac8ca3c431ac99075e603496136606d7da8102f6178ce2796566b30c4659988&redirect_uri=${url}${appEndpoint}&response_type=token`}>
          Authenticate with your YNAB credentials and use the app (recommended to use Chrome)
        </a>
        <a href="/cost-sharer">
          Preview the app without entering YNAB credentials (some sections will look weird)
        </a>
        <div className="divider" />
        <PrivacyPolicy />
      </div>
    </div>
  );
};

export default Home;
