import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { LinkishButton, Hyperlink } from './styledComponents';
import modalNames from './modalNames';

const Container = styled.div`
  margin-bottom: 15px;
`;

const Nav = ({ setActiveModal }) => (
  <Container>
    <Hyperlink
      href="/"
    >
      Home
    </Hyperlink>

    <LinkishButton
      type="button"
      onClick={() => setActiveModal(modalNames.PRIVACY_POLICY)}
    >
      Privacy Policy
    </LinkishButton>

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
