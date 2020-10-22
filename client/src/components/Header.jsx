import React from 'react';
import { push as Menu } from 'react-burger-menu';
import Nav from './Nav.jsx';
import '../styles/Header.css';
import '../styles/Menu.css';

const Header = ({ setPrivacyActive, url, appEndpoint }) => {
  return (
    <header>
      <div className="row">
        <h1>
          Cost Sharing for YNAB
        </h1>
        <img
          src="works_with_ynab.svg"
          alt="Works with YNAB"
          id="works-with-ynab-img"
        />
      </div>
      <Menu right>
        <a href="/">Home</a>
        <div className="small-divider" />
        {
          url &&
            <>
              <a href={`https://app.youneedabudget.com/oauth/authorize?client_id=4ac8ca3c431ac99075e603496136606d7da8102f6178ce2796566b30c4659988&redirect_uri=${url}${appEndpoint}&response_type=token`}>
                Authenticate and use the app (recommended to use Chrome)
              </a>
              <div className="small-divider" />
            </>
        }
        {
          url &&
            <>
              <a href="/cost-sharer">
                Preview the app without authenticating (developer)
              </a>
              <div className="small-divider" />
            </>
        }
        <a href="#privacy-header" id="priv-pol-btn" onClick={() => setPrivacyActive(true)}>Privacy Policy</a>
        <div className="small-divider" />
        <a
          href="https://github.com/chelseaSchmidt/cost-sharing-for-ynab/issues"
          target="_blank"
          rel="noreferrer"
        >
          Report a bug by opening an issue in GitHub
        </a>
      </Menu>
    </header>
  );
};

export default Header;
