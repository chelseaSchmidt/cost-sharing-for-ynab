import React from 'react';
import { func } from 'prop-types';
import PrivacyPolicy from './PrivacyPolicy';
import '../styles/PrivacyWindow.css';

const PrivacyWindow = ({ setPrivacyActive }) => {
  return (
    <>
      <div id="privacy-background" />
      <div id="privacy-policy">
        <PrivacyPolicy />
        {/* <p id="privacy-header">
          Privacy Policy
        </p>
        <p>
          This Privacy Policy describes how your personal information is collected,
          used, and shared when you visit Cost Sharing for YNAB.
        </p>
        <br />
        <p>
          PERSONAL INFORMATION COLLECTED
        </p>
        <p>
          Cost Sharing for YNAB does not collect any personal information. Outside
          of connecting to YNAB itself through their API, there is no database
          connected to Cost Sharing for YNAB in which to store information. Please see
          YNAB&apos;s privacy policy to understand what information is collected by YNAB,
          unrelated to using Cost Sharing for YNAB.
        </p>
        <p>
          Data will be obtained from your YNAB budget for the current active session
          of Cost Sharing for YNAB only, and will not be stored. Cost Sharing for YNAB
          does not pass the data to any third parties.
        </p>
        <p>
          Cost Sharing for YNAB is an open-source web application. If you would like to
          verify any of the above statements, the source-code can be viewed at&nbsp;
          <a href="https://github.com/chelseaSchmidt/cost-sharing-for-ynab">
            https://github.com/chelseaSchmidt/cost-sharing-for-ynab
          </a>
          .
        </p>
        <br />
        <p>
          CHANGES
        </p>
        <p>
          This privacy policy may be updated from time to time in order to reflect
          changes to privacy practices or for other operational, legal or regulatory
          reasons.
        </p>
        <br />
        <p>
          CONTACT
        </p>
        <p>
          For more information about these privacy practices, if you have questions,
          or if you would like to make a complaint, please email
          cost.sharing.for.ynab@gmail.com.
        </p> */}
        <div id="privacy-btn-area">
          <button
            type="button"
            className="update-btn"
            onClick={() => setPrivacyActive(false)}
          >
            Okay, Sounds Good
          </button>
        </div>
      </div>
    </>
  );
};

PrivacyWindow.propTypes = {
  setPrivacyActive: func.isRequired,
};

export default PrivacyWindow;
