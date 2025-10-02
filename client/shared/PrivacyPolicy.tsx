import { CSSProperties } from 'react';
import styled from 'styled-components';
import { PRIVACY_CONTAINER_ID } from './constants';
import Link from './Link';
import { Paragraph } from './styledComponents';

const Container = styled.section``;

const Section = styled.section``;

const Title = styled.h1`
  all: unset;
  display: block;
  font-weight: bold;
  font-size: 20px;
  margin: 20px 0;
`;

const Subtitle = styled.h2`
  all: unset;
  display: block;
  font-weight: bold;
  margin: 40px 0 20px;
`;

const PrivacyParagraph = styled(Paragraph)`
  margin-bottom: 15px;
`;

const LastUpdated = styled(Paragraph)`
  margin-bottom: 0;
  font-weight: bold;
`;

interface Props {
  areHeadingsCentered?: boolean;
  style?: CSSProperties;
}

export default function PrivacyPolicy({ areHeadingsCentered = false, style }: Props) {
  const headingStyle: CSSProperties = areHeadingsCentered ? { textAlign: 'center' } : {};

  return (
    <Container id={PRIVACY_CONTAINER_ID} style={style}>
      <LastUpdated style={headingStyle}>Last updated: April 6th, 2025</LastUpdated>

      <Title style={headingStyle}>PRIVACY POLICY</Title>

      <PrivacyParagraph>
        This Privacy Policy describes how your personal information is collected, used, and shared
        when you visit Cost Sharing for YNAB.
      </PrivacyParagraph>

      <Section>
        <Subtitle style={headingStyle}>PERSONAL INFORMATION COLLECTED</Subtitle>

        <PrivacyParagraph>
          Cost Sharing for YNAB does not collect any personal information. Cost Sharing for YNAB is
          a custom interface which allows you to view and edit your YNAB budget, so please review
          the <Link href="https://www.ynab.com/privacy-policy">YNAB privacy policy</Link> to
          understand what information might be collected by YNAB in the normal course of viewing and
          editing your budget.
        </PrivacyParagraph>

        <PrivacyParagraph>
          Data will be obtained from your YNAB budget for the current active session of Cost Sharing
          for YNAB only, and will not be stored. Cost Sharing for YNAB does not pass the data to any
          third parties.
        </PrivacyParagraph>

        <PrivacyParagraph>
          Cost Sharing for YNAB is not affiliated, associated, or in any way officially connected
          with YNAB, or any of its subsidiaries or its affiliates. The developer is a fan of YNAB
          and wanted to add a custom feature, and so created this application. The official YNAB
          website can be found at <Link href="https://www.ynab.com">https://www.ynab.com</Link>. The
          names YNAB and You Need A Budget as well as related names, marks, emblems and images are
          registered trademarks of YNAB.
        </PrivacyParagraph>

        <PrivacyParagraph>
          Cost Sharing for YNAB is an open-source web application. The source code can be viewed at{' '}
          <Link href="https://github.com/chelseaSchmidt/cost-sharing-for-ynab">
            github.com/chelseaSchmidt/cost-sharing-for-ynab
          </Link>
          .
        </PrivacyParagraph>
      </Section>

      <Section>
        <Subtitle style={headingStyle}>CHANGES</Subtitle>

        <PrivacyParagraph>
          This privacy policy may be updated from time to time in order to reflect changes to
          privacy practices or for other operational, legal or regulatory reasons. Please review it
          for changes periodically.
        </PrivacyParagraph>
      </Section>

      <Section>
        <Subtitle style={headingStyle}>CONTACT</Subtitle>

        <PrivacyParagraph>
          If you have any questions about this privacy policy, please email{' '}
          <Link internal href="mailto:cost.sharing.for.ynab@gmail.com">
            cost.sharing.for.ynab@gmail.com
          </Link>
          .
        </PrivacyParagraph>
      </Section>
    </Container>
  );
}
