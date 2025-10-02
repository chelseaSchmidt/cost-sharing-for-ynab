import styled from 'styled-components';
import { PRIVACY_CONTAINER_ID } from './constants';

const Container = styled.div``;

const Header = styled.p`
  font-weight: bold;
  font-size: 20px;
`;

const Subtitle = styled.p`
  font-weight: bold;
`;

const InLineLink = styled.a`
  overflow-wrap: anywhere;
`;

const PrivacyPolicy = ({ headerStyle = {}, subtitleStyle = {} }) => (
  <Container id={PRIVACY_CONTAINER_ID}>
    <Subtitle style={subtitleStyle}>Last updated: April 6th, 2025</Subtitle>
    <Header style={headerStyle}>Privacy Policy</Header>
    <p>
      This Privacy Policy describes how your personal information is collected, used, and shared
      when you visit Cost Sharing for YNAB.
    </p>
    <br />
    <Subtitle style={subtitleStyle}>PERSONAL INFORMATION COLLECTED</Subtitle>
    <p>
      Cost Sharing for YNAB does not collect any personal information. Cost Sharing for YNAB is a
      custom interface which allows you to view and edit your YNAB budget, so please review
      the&nbsp;
      <InLineLink href="https://www.ynab.com/privacy-policy" target="_blank" rel="noreferrer">
        YNAB privacy policy
      </InLineLink>
      &nbsp;to understand what information might be collected by YNAB in the normal course of
      viewing and editing your budget.
    </p>
    <p>
      Data will be obtained from your YNAB budget for the current active session of Cost Sharing for
      YNAB only, and will not be stored. Cost Sharing for YNAB does not pass the data to any third
      parties.
    </p>
    <p>
      Cost Sharing for YNAB is not affiliated, associated, or in any way officially connected with
      YNAB, or any of its subsidiaries or its affiliates. The developer is a fan of YNAB and wanted
      to add a custom feature, and so created this application. The official YNAB website can be
      found at&nbsp;
      <InLineLink href="https://www.ynab.com" target="_blank" rel="noreferrer">
        https://www.ynab.com
      </InLineLink>
      . The names YNAB and You Need A Budget as well as related names, marks, emblems and images are
      registered trademarks of YNAB.
    </p>
    <p>
      Cost Sharing for YNAB is an open-source web application. The source code can be viewed
      at&nbsp;
      <InLineLink
        href="https://github.com/chelseaSchmidt/cost-sharing-for-ynab"
        target="_blank"
        rel="noreferrer"
      >
        github.com/chelseaSchmidt/cost-sharing-for-ynab
      </InLineLink>
      .
    </p>
    <br />
    <Subtitle style={subtitleStyle}>CHANGES</Subtitle>
    <p>
      This privacy policy may be updated from time to time in order to reflect changes to privacy
      practices or for other operational, legal or regulatory reasons. Please review it for changes
      periodically.
    </p>
    <br />
    <Subtitle style={subtitleStyle}>CONTACT</Subtitle>
    <p>
      If you have any questions about this privacy policy, please email&nbsp;
      <InLineLink href="mailto:cost.sharing.for.ynab@gmail.com" target="_blank" rel="noreferrer">
        cost.sharing.for.ynab@gmail.com
      </InLineLink>
      .
    </p>
  </Container>
);

export default PrivacyPolicy;
