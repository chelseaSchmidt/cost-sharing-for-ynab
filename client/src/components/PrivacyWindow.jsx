import React from 'react';
import { func } from 'prop-types';
import PrivacyPolicy from './PrivacyPolicy';
import '../styles/PrivacyWindow.css';

const PrivacyWindow = ({ setShouldDisplayPrivacyPolicy }) => (
  <>
    <div id="privacy-background" />
    <div id="privacy-policy">
      <PrivacyPolicy />
      <div id="privacy-btn-area">
        <button
          type="button"
          className="update-btn"
          onClick={() => setShouldDisplayPrivacyPolicy(false)}
        >
          Okay, Sounds Good
        </button>
      </div>
    </div>
  </>
);

PrivacyWindow.propTypes = {
  setShouldDisplayPrivacyPolicy: func.isRequired,
};

export default PrivacyWindow;
