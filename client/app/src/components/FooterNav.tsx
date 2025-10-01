import React from 'react';
import styled from 'styled-components';
import breakpoints from '../../../shared/breakpoints';
import { Hyperlink } from '../../../shared/styledComponents';
import { ModalName } from '../types';

const Container = styled.div`
  margin-bottom: 15px;
  font-size: 12px;

  @media (max-width: ${breakpoints.mobile}) {
    display: flex;
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
        <Hyperlink href={`mailto:${EMAIL}`}>{EMAIL}</Hyperlink>,
        <Hyperlink href="/">Home</Hyperlink>,
        <Hyperlink
          as="button"
          type="button"
          onClick={() => setActiveModal(ModalName.PRIVACY_POLICY)}
        >
          Privacy Policy
        </Hyperlink>,
        <Hyperlink
          href="https://github.com/chelseaSchmidt/cost-sharing-for-ynab"
          target="_blank"
          rel="noreferrer"
        >
          Source Code & Bug Reporting
        </Hyperlink>,
      ].map((link, i) => (
        <React.Fragment key={i}>
          {link}
          <DesktopDelimiter>·</DesktopDelimiter>
        </React.Fragment>
      ))}
    </Container>
  );
}
