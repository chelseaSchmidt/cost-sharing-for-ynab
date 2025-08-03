import styled from 'styled-components';
import PrivacyPolicy from '../../../shared/PrivacyPolicy';
import Header from '../../../shared/Header';
import Instructions from '../../../shared/Instructions';
import { MenuItem } from '../../../shared/NavMenu';
import { Hyperlink } from '../../../shared/styledComponents';
import creditCardSrc from '../assets/creditCard.png';
import lightBulbSrc from '../assets/lightBulb.png';
import puzzleIconSrc from '../assets/puzzle.png';
import welcomeIconSrc from '../assets/welcome.png';
import colors from '../styles/colors';
import '../styles/global.css';

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

const Subtitle = styled.header`
  margin: 40px 0;
  width: 100%;
  min-width: 190px;
  text-align: center;
  font-size: 30px;
  text-shadow: 0 3px 11px ${colors.lightNeutralAccent};
`;

const Divider = styled.div`
  border-top: 1px solid ${colors.lightNeutralAccent};
  width: 100%;
  max-width: 1200px;
  margin: 70px 0;
`;

const Button = styled.button`
  box-sizing: border-box;
  background: ${colors.button};
  border-radius: 5px;
  box-shadow: 0 1px 2px 0 #666;
  padding: 7px 15px;
  margin: 10px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: white;
  text-decoration: none;

  &:hover {
    background: ${colors.lightNeutralAccent};
  }

  &:active {
    background: ${colors.buttonActive};
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

  &:last-child {
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
`;

const PrivacyPolicyContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${colors.lightNeutralBg};
  margin: 40px 0 -10px 0;
  padding: 40px;
  border-top: 1px solid ${colors.lightNeutralAccent};
  width: 100vw;
`;

const Footer = styled.footer`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  border-top: 1px solid ${colors.lightNeutralAccent};
  padding: 40px 10px;

  a {
    margin-bottom: 10px;
    overflow-wrap: anywhere;
    text-align: center;
  }
`;

/* Main Component */

const Home = () => {
  const APP_ENDPOINT = 'cost-sharer';

  const ynabAuthLink = `https://app.youneedabudget.com/oauth/authorize?client_id=4ac8ca3c431ac99075e603496136606d7da8102f6178ce2796566b30c4659988&redirect_uri=${window.location.href}${APP_ENDPOINT}&response_type=token`;

  const navMenuItems: MenuItem[] = [
    { text: 'Start', attributes: { href: ynabAuthLink }, style: { fontWeight: 'bold' } },
    { text: 'Preview Without a YNAB Account', attributes: { href: `/${APP_ENDPOINT}` } },
    {
      text: 'Privacy Policy',
      onClick: () => {
        document.getElementById('privacy-policy-container')?.scrollIntoView(true);
      },
      attributes: { type: 'button', as: 'button' },
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
      <Header navMenuItems={navMenuItems} style={{ marginBottom: '15px' }} />

      <ContentContainer>
        <CreditCardIcon src={creditCardSrc} alt="credit card" />

        <Subtitle>Conveniently manage a shared credit card in YNAB.</Subtitle>

        <Description>
          {[
            {
              src: welcomeIconSrc,
              alt: 'Welcome',
              text: "Hi fellow YNABer! If you're using a shared credit card or bank account for communal expenses, and want to track it in YNAB more easily, you're in the right place.",
            },
            {
              src: puzzleIconSrc,
              alt: 'The Problem',
              text: 'A shared bank account or credit card is difficult to track in YNAB without your expenses appearing inflated. Maybe you\'ve resorted to excluding it from YNAB completely. Or, maybe you\'re throwing the costs into a blanket "shared expense" category, and later divvying up the total - which fixes the inflation problem, but masks where exactly the dollars are going.',
            },
            {
              src: lightBulbSrc,
              alt: 'The Solution',
              text: "Cost Sharing for YNAB enables you to classify your transactions across any number of categories, and then at the click of a button, remove someone else's share of the expenses from each category. No more inflated expenses or catch-all category!",
            },
          ].map(({ src, alt, text }) => (
            <DescriptionSection key={alt}>
              <DescriptionIcon src={src} alt={alt} />
              <DescriptionText>{text}</DescriptionText>
            </DescriptionSection>
          ))}
        </Description>

        <Divider />

        <Subtitle>Getting Started</Subtitle>

        <InstructionsContainer>
          <Instructions isHomePage />
        </InstructionsContainer>

        <Button as="a" href={ynabAuthLink}>
          Start
        </Button>

        <Button as="a" href={`/${APP_ENDPOINT}`}>
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
        {[
          {
            href: 'https://www.flaticon.com/search?word=credit%20card&type=icon',
            children: 'Credit card icons created by Freepik - Flaticon',
          },
          {
            href: 'https://www.flaticon.com/free-icons/welcome',
            children: ' Welcome icons created by Freepik - Flaticon',
          },
          {
            href: 'https://www.flaticon.com/free-icons/puzzle',
            children: 'Puzzle icons created by Freepik - Flaticon',
          },
          {
            href: 'https://www.flaticon.com/free-icons/solution',
            children: 'Solution icons created by Freepik - Flaticon',
          },
        ].map((props) => (
          <Hyperlink {...props} key={props.href} target="_blank" rel="noreferrer" />
        ))}
      </Footer>
    </Container>
  );
};

export default Home;
