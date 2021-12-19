import React from 'react';
import { func } from 'prop-types';
import '../styles/Nav.css';

const Nav = ({ setActiveModal }) => (
  <div id="nav-container">
    <a
      className="link-btn"
      href="/"
    >
      Home
    </a>
    <button
      className="link-btn"
      id="priv-pol-btn"
      type="button"
      onClick={() => setActiveModal('privacyPolicy')}
    >
      Privacy Policy
    </button>
    <a
      className="link-btn"
      href="https://github.com/chelseaSchmidt/cost-sharing-for-ynab/issues"
      target="_blank"
      rel="noreferrer"
    >
      Report a Bug
    </a>
  </div>
);

Nav.propTypes = {
  setActiveModal: func.isRequired,
};

export default Nav;
