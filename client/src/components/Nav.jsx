import React from 'react';
import '../styles/Nav.css';

const Nav = ({ setPrivacyActive }) => {
  return (
    <div id="nav-container">
      <button
        type="button"
        className="link-btn"
        onClick={() => setPrivacyActive(true)}
      >
        View privacy policy
      </button>
      <a
        className="link-btn"
        href="https://github.com/chelseaSchmidt/cost-sharing-for-ynab/issues"
        target="_blank"
        rel="noreferrer"
      >
        Report a bug by opening an issue in GitHub
      </a>
      <a
        className="link-btn"
        href="/"
      >
        Return to website
      </a>
    </div>
  );
};

export default Nav;
