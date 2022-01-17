import React, { useState } from 'react';
import { push as Menu } from 'react-burger-menu';
import { func, string, object } from 'prop-types';
import styled from 'styled-components';
import '../appSrc/styles/Header.css';
import '../appSrc/styles/Menu.css';

const Row = styled.div`
  display: flex;
`;

const Header = ({
  setActiveModal = () => {},
  landingPageUrl,
  appEndpoint,
  style = {},
}) => {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const handleStateChange = (state) => setMenuIsOpen(state.isOpen);
  return (
    <header style={style}>
      <Row>
        <h1>
          Cost Sharing for YNAB
        </h1>
        <img
          src="works_with_ynab.svg"
          alt="Works with YNAB"
          id="works-with-ynab-img"
        />
      </Row>
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
          landingPageUrl
          && (
            <>
              <a
                href={`https://app.youneedabudget.com/oauth/authorize?client_id=4ac8ca3c431ac99075e603496136606d7da8102f6178ce2796566b30c4659988&redirect_uri=${landingPageUrl}${appEndpoint}&response_type=token`}
                onClick={() => setMenuIsOpen(false)}
                className="menu-link"
              >
                <b>Start</b>
              </a>
              <div className="small-divider" />
              <a
                href="/cost-sharer"
                onClick={() => setMenuIsOpen(false)}
                className="menu-link"
              >
                Preview Without a YNAB Account
              </a>
              <div className="small-divider" />
            </>
          )
        }
        <button
          id="priv-pol-btn"
          type="button"
          onClick={() => {
            if (landingPageUrl) {
              document.getElementById('privacy-policy-container').scrollIntoView(true);
            } else {
              setActiveModal('privacyPolicy');
            }
            setMenuIsOpen(false);
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
          Report a Bug
        </a>
      </Menu>
    </header>
  );
};

Header.propTypes = {
  setActiveModal: func,
  landingPageUrl: string,
  appEndpoint: string,
  style: object,
};

export default Header;
