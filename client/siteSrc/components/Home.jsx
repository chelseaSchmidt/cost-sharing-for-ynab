import React from 'react';
import PrivacyPolicy from '../../src/components/PrivacyPolicy';
import Header from '../../src/components/Header';
import Instructions from '../../src/components/Instructions';
import '../styles/Home.css';

const Home = () => {
  const url = window.location.href;
  const appEndpoint = 'cost-sharer';
  return (
    <div>
      <Header setPrivacyActive={() => {}} url={url} appEndpoint={appEndpoint} />
      <div id="content-container" className="column">
        <p className="description tagline">
          Track a shared credit card in YNAB without inflating your expenses.
        </p>
        <div className="divider" />
        <p className="description">
          {`
            Do you and a partner use a shared credit card for communal expenses?
            Do you want to sync the credit card with your YNAB budget to keep track
            of where your dollars are going, without your expenses looking doubled?
            Cost Sharing for YNAB can help!
          `}
        </p>
        <div className="divider" />
        <div className="subtitle">GETTING STARTED</div>
        <Instructions />
        <button
          type="button"
          onClick={
            (e) => {
              e.preventDefault();
              window.location.href = `https://app.youneedabudget.com/oauth/authorize?client_id=4ac8ca3c431ac99075e603496136606d7da8102f6178ce2796566b30c4659988&redirect_uri=${url}${appEndpoint}&response_type=token`;
            }
          }
          className="update-btn"
        >
          Start
        </button>
        <button
          type="button"
          onClick={
            (e) => {
              e.preventDefault();
              window.location.href = '/cost-sharer';
            }
          }
          className="update-btn"
        >
          Preview without a YNAB account
        </button>
        <div className="privacy-policy-container">
          <PrivacyPolicy />
        </div>
      </div>
    </div>
  );
};

export default Home;
