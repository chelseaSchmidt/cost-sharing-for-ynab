import React from 'react';
import Nav from './Nav.jsx';
import '../styles/Header.css';

const Header = ({ setPrivacyActive }) => {
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
      <Nav setPrivacyActive={setPrivacyActive} />
    </header>
  );
};

export default Header;
