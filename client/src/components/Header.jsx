import React, { useState } from 'react';
import { push as Menu } from 'react-burger-menu';
import { func, string } from 'prop-types';
import '../styles/Header.css';
import '../styles/Menu.css';

const Header = ({ setPrivacyActive, url, appEndpoint }) => {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const handleStateChange = (state) => setMenuIsOpen(state.isOpen);
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
      <div
        id="menu-click-area"
        role="button"
        aria-label="Select menu"
        tabIndex={0}
        onClick={() => document.getElementById('react-burger-menu-btn').click()}
        onKeyDown={() => document.getElementById('react-burger-menu-btn').click()}
      />
      <Menu
        right
        isOpen={menuIsOpen}
        onStateChange={(state) => handleStateChange(state)}
      >
        <a href="/" className="menu-link">Home</a>
        <div className="small-divider" />
        {
          url
          && (
            <>
              <a
                href={`https://app.youneedabudget.com/oauth/authorize?client_id=4ac8ca3c431ac99075e603496136606d7da8102f6178ce2796566b30c4659988&redirect_uri=${url}${appEndpoint}&response_type=token`}
                onClick={() => setMenuIsOpen(false)}
                className="menu-link"
              >
                Use the App (Chrome Recommended)
              </a>
              <div className="small-divider" />
            </>
          )
        }
        {
          url
          && (
            <>
              <a
                href="/cost-sharer"
                onClick={() => setMenuIsOpen(false)}
                className="menu-link"
              >
                Preview the App Without YNAB Credentials (Bugs Expected)
              </a>
              <div className="small-divider" />
            </>
          )
        }
        <button
          id="priv-pol-btn"
          type="button"
          onClick={() => {
            setPrivacyActive(true);
            setMenuIsOpen(false);
            if (url) {
              document.getElementById('privacy-policy-text').scrollIntoView(true);
            }
          }}
          className="menu-link"
        >
          Privacy Policy
        </button>
        <div className="small-divider" />
        <a
          href="https://github.com/chelseaSchmidt/cost-sharing-for-ynab/issues"
          target="_blank"
          rel="noreferrer"
          onClick={() => setMenuIsOpen(false)}
          className="menu-link"
        >
          Report a bug by opening an issue in GitHub
        </a>
      </Menu>
    </header>
  );
};

Header.propTypes = {
  setPrivacyActive: func.isRequired,
  url: string,
  appEndpoint: string,
};

export default Header;
