import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import breakpoints from '../../shared/breakpoints';
import modalNames from './modalNames';
import { LinkishButton, Hyperlink } from './styledComponents';

const Container = styled.div`
  margin-bottom: 15px;
  font-size: 12px;
  @media (max-width: ${breakpoints.mobile}) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const DesktopSpacer = styled.span`
  @media (max-width: ${breakpoints.mobile}) {
    display: none;
  }
`;

const MobileSpacer = styled.div`
  display: none;
  @media (max-width: ${breakpoints.mobile}) {
    display: flex;
    height: 7px;
  }
`;

const Nav = ({ setActiveModal }) => (
  <Container>
    <Hyperlink
      href="mailto:cost.sharing.for.ynab@gmail.com"
    >
      cost.sharing.for.ynab@gmail.com
    </Hyperlink>

    <DesktopSpacer>·</DesktopSpacer>
    <MobileSpacer />

    <Hyperlink
      href="/"
    >
      Home
    </Hyperlink>

    <DesktopSpacer>·</DesktopSpacer>
    <MobileSpacer />

    <LinkishButton
      type="button"
      onClick={() => setActiveModal(modalNames.PRIVACY_POLICY)}
    >
      Privacy Policy
    </LinkishButton>

    <DesktopSpacer>·</DesktopSpacer>
    <MobileSpacer />

    <Hyperlink
      href="https://github.com/chelseaSchmidt/cost-sharing-for-ynab"
      target="_blank"
      rel="noreferrer"
    >
      GitHub Repo
    </Hyperlink>
  </Container>
);

Nav.propTypes = {
  setActiveModal: PropTypes.func.isRequired,
};

export default Nav;
