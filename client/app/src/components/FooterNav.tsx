import React from 'react';
import styled from 'styled-components';
import breakpoints from '../../../shared/breakpoints';
import Link from '../../../shared/Link';
import { FlexRow } from '../../../shared/styledComponents';
import { ModalName } from '../types';

const Container = styled(FlexRow)`
  margin-bottom: 15px;
  font-size: 12px;
  gap: 10px;

  @media (max-width: ${breakpoints.mobile}) {
    flex-direction: column;
    align-items: center;
    gap: 7px;
  }
`;

const DesktopDelimiter = styled.span`
  &:last-child {
    display: none;
  }

  @media (max-width: ${breakpoints.mobile}) {
    display: none;
  }
`;

interface Props {
  setActiveModal: (modalName: ModalName) => void;
}

export default function FooterNav({ setActiveModal }: Props) {
  const EMAIL = 'cost.sharing.for.ynab@gmail.com';

  return (
    <Container>
      {[
        <Link theme="subtle" href={`mailto:${EMAIL}`} internal>
          {EMAIL}
        </Link>,
        <Link theme="subtle" href="/">
          Home
        </Link>,
        <Link theme="subtle" asButton onClick={() => setActiveModal(ModalName.PRIVACY_POLICY)}>
          Privacy Policy
        </Link>,
        <Link theme="subtle" href="https://github.com/chelseaSchmidt/cost-sharing-for-ynab">
          Source Code & Bug Reporting
        </Link>,
      ].map((link, i) => (
        <React.Fragment key={i}>
          {link}
          <DesktopDelimiter>·</DesktopDelimiter>
        </React.Fragment>
      ))}
    </Container>
  );
}
