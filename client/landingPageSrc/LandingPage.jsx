import React from 'react';
import styled from 'styled-components';

import PrivacyPolicy from '../shared/PrivacyPolicy';
import Header from '../shared/Header';
import Instructions from '../shared/Instructions';
import { Hyperlink } from '../appSrc/components/styledComponents'; // FIXME: move to shared directory
import './global.css';

/* Styled Components */

const Container = styled.div``;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 30px 40px 10px 40px;
  align-items: center;
`;

const CreditCardIcon = styled.img`
  width: 100px;
  height: auto;
  object-fit: contain;
`;

const Tagline = styled.p`
  margin: 40px 0 40px 0;
  width: 100%;
  min-width: 190px;
  font-size: 30px;
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

const TextContainer = styled.div`
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
`;

const InstructionsContainer = styled(TextContainer)`
  margin: unset;
  max-width: 650px;

  ol {
    margin: 10px;
  }
`;

const Description = styled.div`
  width: 65%;
  max-width: 650px;
  min-width: 200px;
  margin: 10px;
  font-size: 16px;

  @media (max-width: 880px) {
    width: 80%;
  }

  @media (max-width: 450px) {
    text-align: unset;
    width: 100%;
  }
`;

const DescriptionSection = styled.section`
  display: flex;
  align-items: center;
  margin-bottom: 75px;

  :last-child {
    margin-bottom: 0;
  }

  @media (max-width: 650px) {
    flex-direction: column;
  }
`;

const DescriptionIcon = styled.img`
  flex-grow: 0;
  flex-shrink: 0;
  width: 70px;
  height: auto;
  object-fit: contain;

  @media (max-width: 650px) {
    width: 50px;
    margin-bottom: 20px;
  }
`;

const DescriptionText = styled.div`
  box-sizing: border-box;
  padding-left: 20px;
  height: fit-content;
`;

const PrivacyPolicyContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #eee;
  margin: 40px 0 -10px 0;
  padding: 40px;
  border-top: 1px solid lightgray;
  width: 100vw;
`;

const Footer = styled.footer`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  border-top: 1px solid lightgray;
  padding: 40px 10px;

  a {
    margin-bottom: 10px;
    overflow-wrap: anywhere;
    text-align: center;
  }
`;

/* Main Component */

const LandingPage = () => {
  const currentUrl = window.location.href;
  const appEndpoint = 'cost-sharer';
  const ynabAuthScreenLink = `https://app.youneedabudget.com/oauth/authorize?client_id=4ac8ca3c431ac99075e603496136606d7da8102f6178ce2796566b30c4659988&redirect_uri=${currentUrl}${appEndpoint}&response_type=token`;
  const navMenuItems = [
    {
      text: 'Start',
      attributes: {
        href: ynabAuthScreenLink,
      },
      style: {
        fontWeight: 'bold',
      },
    },
    {
      text: 'Preview Without a YNAB Account',
      attributes: {
        href: `/${appEndpoint}`,
      },
    },
    {
      text: 'Privacy Policy',
      onClick: () => {
        document.getElementById('privacy-policy-container').scrollIntoView(true);
      },
      attributes: {
        type: 'button',
      },
    },
    {
      text: 'GitHub Repo',
      attributes: {
        href: 'https://github.com/chelseaSchmidt/cost-sharing-for-ynab',
        target: '_blank',
        rel: 'noreferrer',
      },
    },
  ];

  return (
    <Container>
      <Header
        navMenuItems={navMenuItems}
        style={{ marginBottom: '15px' }}
      />

      <ContentContainer>
        <CreditCardIcon
          src="creditCard.png"
          alt="credit card"
        />

        <Tagline>
          Conveniently manage a shared credit card in YNAB.
        </Tagline>

        <Description>
          <DescriptionSection>
            <DescriptionIcon
              src="welcome.png"
              alt="Welcome"
            />

            <DescriptionText>
              Hi fellow YNABer! If you&apos;re using a shared credit card or bank account
              for communal expenses, and want to track it in YNAB more easily, you&apos;re
              in the right place!
            </DescriptionText>
          </DescriptionSection>

          <DescriptionSection>
            <DescriptionIcon
              src="puzzle.png"
              alt="The Problem"
            />

            <DescriptionText>
              A shared bank account or credit card is difficult to track in YNAB without
              your expenses appearing doubled. Maybe you&apos;ve resorted to excluding it
              from YNAB completely. Or, maybe you&apos;re throwing the costs into a blanket
              &quot;shared expense&quot; category, and later splitting the total in half - which
              fixes the doubling problem, but masks where exactly the dollars are going.
            </DescriptionText>
          </DescriptionSection>

          <DescriptionSection>
            <DescriptionIcon
              src="lightBulb.png"
              alt="The Solution"
            />

            <DescriptionText>
              Cost Sharing for YNAB allows you to classify your transactions across any number
              of categories, and then at the click of a button, pull half those costs out of
              each one. No more doubled-up expenses or catch-all category!
            </DescriptionText>
          </DescriptionSection>
        </Description>

        <Divider />

        <Subtitle>GETTING STARTED</Subtitle>

        <InstructionsContainer>
          <Instructions isHomePage />
        </InstructionsContainer>

        <Button
          type="button"
          onClick={
            (e) => {
              e.preventDefault();
              window.location.href = ynabAuthScreenLink;
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
              window.location.href = `/${appEndpoint}`;
            }
          }
        >
          Preview without a YNAB account
        </Button>

        <PrivacyPolicyContainer>
          <TextContainer>
            <PrivacyPolicy
              headerStyle={{
                marginBottom: '10px',
                textTransform: 'uppercase',
                textAlign: 'center',
              }}
              subtitleStyle={{
                textAlign: 'center',
              }}
            />
          </TextContainer>
        </PrivacyPolicyContainer>
      </ContentContainer>

      <Footer>
        <Hyperlink
          href="https://www.flaticon.com/search?word=credit%20card&type=icon"
          title="credit card icons"
          target="_blank"
          rel="noreferrer"
        >
          Credit card icons created by Freepik - Flaticon
        </Hyperlink>
        <Hyperlink
          href="https://www.flaticon.com/free-icons/welcome"
          title="welcome icons"
          target="_blank"
          rel="noreferrer"
        >
          Welcome icons created by Freepik - Flaticon
        </Hyperlink>
        <Hyperlink
          href="https://www.flaticon.com/free-icons/puzzle"
          title="puzzle icons"
          target="_blank"
          rel="noreferrer"
        >
          Puzzle icons created by Freepik - Flaticon
        </Hyperlink>
        <Hyperlink
          href="https://www.flaticon.com/free-icons/solution"
          title="solution icons"
          target="_blank"
          rel="noreferrer"
        >
          Solution icons created by Freepik - Flaticon
        </Hyperlink>
      </Footer>
    </Container>
  );
};

export default LandingPage;
