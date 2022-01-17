import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Container = styled.div`
  ${({ isHomePage }) => isHomePage && `
    width: 65%;
    max-width: 950px;
    min-width: 200px;
    margin: 10px;
    align-items: center;

    @media (max-width: 880px) {
      width: 680px;
    }

    @media (max-width: 770px) {
      width: 95%;
    }
  `}
`;

const Header = styled.p`
  font-weight: bold;
  font-size: 20px;
`;

const Subtitle = styled.p`
  font-weight: bold;
`;

const PrivacyPolicy = ({
  isHomePage = false,
  headerStyle = {},
  subtitleStyle = {},
}) => (
  <Container
    isHomePage={isHomePage}
    id="privacy-policy-container"
  >
    <Header
      style={headerStyle}
    >
      Privacy Policy
    </Header>
    <p>
      This Privacy Policy describes how your personal information is collected,
      used, and shared when you visit Cost Sharing for YNAB.
    </p>
    <br />
    <Subtitle style={subtitleStyle}>
      PERSONAL INFORMATION COLLECTED
    </Subtitle>
    <p>
      Cost Sharing for YNAB does not collect any personal information. Outside
      of connecting to YNAB itself through their API, there is no database
      connected to Cost Sharing for YNAB in which to store information. Cost
      Sharing for YNAB allows you to view and edit your YNAB budget through a
      custom interface, so please see YNAB&apos;s privacy policy to understand
      what information might be collected by YNAB in the normal course of
      viewing and editing your budget.
    </p>
    <p>
      Data will be obtained from your YNAB budget for the current active session
      of Cost Sharing for YNAB only, and will not be stored. Cost Sharing for YNAB
      does not pass the data to any third parties.
    </p>
    <p>
      Cost Sharing for YNAB is an open-source web application. If you would like to
      verify any of the above statements, the source-code can be viewed at&nbsp;
      <a
        href="https://github.com/chelseaSchmidt/cost-sharing-for-ynab"
        target="_blank"
        rel="noreferrer"
      >
        https://github.com/chelseaSchmidt/cost-sharing-for-ynab
      </a>
      .
    </p>
    <br />
    <Subtitle style={subtitleStyle}>
      CHANGES
    </Subtitle>
    <p>
      This privacy policy may be updated from time to time in order to reflect
      changes to privacy practices or for other operational, legal or regulatory
      reasons.
    </p>
    <br />
    <Subtitle style={subtitleStyle}>
      CONTACT
    </Subtitle>
    <p>
      For more information about these privacy practices, if you have questions,
      or if you would like to make a complaint, please email
      cost.sharing.for.ynab@gmail.com.
    </p>
  </Container>
);

PrivacyPolicy.propTypes = {
  isHomePage: PropTypes.bool,
  headerStyle: PropTypes.object,
  subtitleStyle: PropTypes.object,
};

export default PrivacyPolicy;
