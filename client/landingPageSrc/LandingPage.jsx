import React from 'react';
import styled from 'styled-components';

import PrivacyPolicy from '../sharedComponents/PrivacyPolicy';
import Header from '../sharedComponents/Header';
import Instructions from '../sharedComponents/Instructions';
import './global.css';

/* Styled Components */

const Container = styled.div``;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 40px;
  align-items: center;
`;

const Tagline = styled.p`
  margin: 30px 0 0 0;
  width: 100%;
  font-size: 25px;
  text-align: center;
  text-shadow: 0 3px 11px lightgray;
`;

const Divider = styled.div`
  box-sizing: border-box;
  border-top: 1px solid lightgray;
  margin: 70px 0;
  width: 70%;
  min-width: 700px;

  @media (max-width: 770px) {
    width: 100%;
    min-width: unset;
  }
`;

const Subtitle = styled.div`
  font-weight: bold;
  font-size: 20px;
  margin: 0 0 20px 0;
  text-transform: uppercase;
  text-align: center;
`;

const Button = styled.button`
  box-sizing: border-box;
  background-color: #11518c;
  border-radius: 12px;
  border: 1px solid white;
  box-shadow: 0 1px 2px 0 #515852;
  padding: 7px 15px;
  margin: 10px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: white;
  font-size: 14px;
  text-decoration: none;
  font-weight: 400;
  cursor: pointer;

  :hover {
    background-color: lightgray;
  }
`;

const PrivacyPolicyContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  background-color: #eee;
  margin: 40px 0 -10px 0;
  padding: 40px;
  border-top: 1px solid lightgray;
  width: 100vw;
`;

const Description = styled.p`
  font-size: 16px;
  text-align: justify;
  width: 65%;
  max-width: 950px;
  min-width: 200px;
  margin: 10px;

  @media (max-width: 880px) {
    width: 680px;
  }

  @media (max-width: 770px) {
    width: 95%;
  }

  @media (max-width: 450px) {
    text-align: unset;
  }
`;

/* Main Component */

const LandingPage = () => {
  const currentUrl = window.location.href;
  const appEndpoint = 'cost-sharer';

  return (
    <Container>
      <Header setPrivacyActive={() => {}} url={currentUrl} appEndpoint={appEndpoint} />

      <ContentContainer>
        <Tagline>
          Conveniently manage a shared credit card in YNAB.
        </Tagline>

        <Divider />

        <Description>
          Do you and a partner use a shared credit card for communal expenses?
          Do you want to sync the credit card with your YNAB budget to keep track
          of where your dollars are going, without your expenses looking doubled?
          Cost Sharing for YNAB can help!
        </Description>

        <Divider />

        <Subtitle>GETTING STARTED</Subtitle>

        <Instructions isHomePage />

        <Button
          type="button"
          onClick={
            (e) => {
              e.preventDefault();
              window.location.href = `https://app.youneedabudget.com/oauth/authorize?client_id=4ac8ca3c431ac99075e603496136606d7da8102f6178ce2796566b30c4659988&redirect_uri=${currentUrl}${appEndpoint}&response_type=token`;
            }
          }
        >
          Start
        </Button>

        <Button
          type="button"
          onClick={
            (e) => {
              e.preventDefault();
              window.location.href = '/cost-sharer';
            }
          }
        >
          Preview without a YNAB account
        </Button>

        <PrivacyPolicyContainer>
          <PrivacyPolicy />
        </PrivacyPolicyContainer>
      </ContentContainer>
    </Container>
  );
};

export default LandingPage;
