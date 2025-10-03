import { useState } from 'react';
import styled from 'styled-components';
import Button from '../../../shared/Button';
import colors from '../../../shared/colors';
import Instructions from '../../../shared/Instructions';
import Link from '../../../shared/Link';
import PrivacyPolicy from '../../../shared/PrivacyPolicy';
import { FlexColumn, FlexColumnCentered, Paragraph } from '../../../shared/styledComponents';
import creditCardSrc from '../assets/creditCard.png';
import lightBulbSrc from '../assets/lightBulb.png';
import puzzleIconSrc from '../assets/puzzle.png';
import welcomeIconSrc from '../assets/welcome.png';
import { APP_ENDPOINT, APP_LINK, CLIENT_ID } from '../constants';
import '../styles/global.css';
import HomeHeader from './HomeHeader';

/* CONSTANTS */

const COLUMN_LAYOUT_BREAKPOINT = '650px';
const TINY_BREAKPOINT = '450px';

/* STYLED COMPONENTS */

const Container = styled.div``;

const MainContent = styled(FlexColumnCentered)`
  padding: 30px 50px 40px;

  @media (max-width: ${TINY_BREAKPOINT}) {
    padding: 30px 30px 40px;
  }
`;

const EmphasisIcon = styled.img`
  height: auto;
  object-fit: contain;
`;

const SubtitleIcon = styled(EmphasisIcon)`
  width: 100px;
  margin-bottom: 40px;
`;

const Subtitle = styled.header`
  margin-bottom: 40px;
  width: 100%;
  min-width: 190px;
  text-align: center;
  font-size: 30px;
  text-shadow: 0 1px 3px ${colors.lightNeutralAccent};
`;

const Intro = styled.div`
  max-width: 650px;
  min-width: 200px;
  margin: 10px;
  font-size: 16px;
`;

const IntroParagraph = styled(Paragraph)`
  display: flex;
  align-items: center;
  margin-bottom: 75px;
  gap: 20px;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: ${COLUMN_LAYOUT_BREAKPOINT}) {
    flex-direction: column;
  }
`;

const IntroIcon = styled(EmphasisIcon)`
  flex-grow: 0;
  flex-shrink: 0;
  width: 70px;

  @media (max-width: ${COLUMN_LAYOUT_BREAKPOINT}) {
    width: 60px;
  }
`;

const IntroText = styled.span``;

const Divider = styled.div`
  border-top: 1px solid ${colors.lightNeutralAccent};
  width: 100%;
  max-width: 1200px;
  margin: 70px 0;
`;

const Controls = styled(FlexColumn)`
  margin-top: 60px;
  gap: 10px;
  font-size: 16px;
`;

const Appendix = styled.div`
  box-sizing: border-box;
  width: 100%;
  min-width: 200px;
`;

const InstructionsContainer = styled(Appendix)`
  max-width: 650px;
`;

const PrivacyContainer = styled(Appendix)`
  max-width: 950px;
  padding: 0 40px;

  @media (max-width: ${TINY_BREAKPOINT}) {
    padding: 0;
  }
`;

const Footer = styled.footer`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  border-top: 1px solid ${colors.lightNeutralAccent};
  padding: 40px 10px;
  background: ${colors.lightNeutralBg};
  font-size: 12px;

  a {
    margin-bottom: 10px;
    overflow-wrap: anywhere;
    text-align: center;

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

/* MAIN */

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const authLink = `https://app.youneedabudget.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${window.location.href}${APP_ENDPOINT}&response_type=token`;

  return (
    <Container>
      <HomeHeader authLink={authLink} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      <MainContent inert={isMenuOpen}>
        <SubtitleIcon src={creditCardSrc} alt="credit card" />

        <Subtitle>Conveniently manage a shared credit card in YNAB.</Subtitle>

        <Intro>
          {[
            {
              src: welcomeIconSrc,
              alt: 'Welcome',
              text: "Hi fellow YNABer! If you're using a shared credit card or bank account for communal expenses, and want to track it in YNAB more easily, you're in the right place.",
            },
            {
              src: puzzleIconSrc,
              alt: 'The Problem',
              text: 'A shared bank account or credit card is difficult to track in YNAB without your expenses appearing inflated. Maybe you\'ve resorted to excluding it from YNAB completely. Or, maybe you\'re throwing the costs into a blanket "shared expense" category, and later divvying up the total—which fixes the inflation problem, but masks where exactly the dollars are going.',
            },
            {
              src: lightBulbSrc,
              alt: 'The Solution',
              text: "Cost Sharing for YNAB enables you to classify your transactions across any number of categories, and then at the click of a button, remove someone else's share of the expenses from each category. No more inflated expenses or catch-all category!",
            },
          ].map(({ src, alt, text }) => (
            <IntroParagraph key={alt}>
              <IntroIcon src={src} alt={alt} />
              <IntroText>{text}</IntroText>
            </IntroParagraph>
          ))}
        </Intro>

        <Controls>
          {[
            { href: authLink, children: 'Start' },
            { href: APP_LINK, children: 'Preview without a YNAB account' },
          ].map((props) => (
            <Button key={props.href} asLink external {...props} />
          ))}
        </Controls>

        <Divider />

        <Subtitle>Guide</Subtitle>

        <InstructionsContainer>
          <Instructions isHomePage />
        </InstructionsContainer>

        <Divider />

        <PrivacyContainer>
          <PrivacyPolicy areHeadingsCentered />
        </PrivacyContainer>
      </MainContent>

      <Footer inert={isMenuOpen}>
        {[
          {
            href: 'https://www.flaticon.com/search?word=credit%20card&type=icon',
            children: 'Credit card icons created by Freepik - Flaticon',
          },
          {
            href: 'https://www.flaticon.com/free-icons/welcome',
            children: 'Welcome icons created by Freepik - Flaticon',
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
          <Link key={props.href} theme="subtle" {...props} />
        ))}
      </Footer>
    </Container>
  );
}
