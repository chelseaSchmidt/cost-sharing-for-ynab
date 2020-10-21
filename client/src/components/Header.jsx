import React from 'react';
import Nav from './Nav.jsx';
import '../styles/Header.css';

const Header = ({ setPrivacyActive }) => {
  return (
    <div id="header-container">
      <header>
        <h1>
          Cost Sharing for YNAB
          <img
          src="works_with_ynab.svg"
          alt="Works with YNAB"
          id="works-with-ynab-img"
        />
        </h1>
        <Nav setPrivacyActive={setPrivacyActive} />
      </header>
    </div>
  );
};

export default Header;
