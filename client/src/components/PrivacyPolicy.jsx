import React from 'react';
import '../styles/PrivacyPolicy.css';

const PrivacyPolicy = ({ setPrivacyActive }) => {
  return (
    <>
      <div id="privacy-background" />
      <div id="privacy-policy">
        <p id="privacy-header">
          Privacy Policy
        </p>
        <p>
          This Privacy Policy describes how your personal information is collected, used, and shared when you visit Cost Sharing For YNAB.
        </p>
        <br />
        <p>
          PERSONAL INFORMATION COLLECTED
        </p>
        <p>
          Cost Sharing For YNAB does not collect any personal information. Outside of YNAB itself, there is no database connected to Cost Sharing For YNAB in which to store information. Please see YNAB's privacy policy to understand what information is collected by YNAB itself, unrelated to using Cost Sharing For YNAB.
        </p>
        <br />
        <p>
          CHANGES
        </p>
        <p>
          This privacy policy may be updated from time to time in order to reflect changes to privacy practices or for other operational, legal or regulatory reasons.
        </p>
        <br />
        <p>
          CONTACT
        </p>
        <p>
          For more information about these privacy practices, if you have questions, or if you would like to make a complaint, please email cost.sharing.for.ynab@gmail.com.
        </p>
        <div id="privacy-btn-area">
          <button className="update-btn" onClick={() => setPrivacyActive(false)} >Okay, Sounds Good</button>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
