import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import modalNames from '../appSrc/components/modalNames';
import NavMenu from './NavMenu';

const Container = styled.header`
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  width: 100%;
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  color: white;
  background-color: #2f73b3;
  margin: 0;
  margin-bottom: 50px;
  padding: 10px 20px;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.5);
  z-index: 4;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
`;

const Title = styled.h1`
  margin-right: 10px;
  font-size: 30px;
  letter-spacing: 1px;
  font-weight: 800;
  text-shadow: 0 1px 1px #545353;
`;

const WorksWithYnabIcon = styled.img`
  width: 144.07px;
  height: 57.33px;
`;

const Divider = styled.div`
  border-top: 1px solid lightgray;
  width: 100%;
`;

const MenuItem = styled.a`
  text-decoration: none;
  color: #464b46;
  text-align: left;
  padding: 20px 10px;
  border-radius: 2px;
  font-size: 1.15em;
  cursor: pointer;

  :hover, :visited:hover {
    color: #2f73b3;
    background-color: #eee;
  }

  :visited {
    color: #464b46;
  }
`;

const Header = ({
  onLandingPage,
  ynabAuthScreenLink,
  setActiveModal = () => {},
  style = {},
}) => {
  const menuItemClassName = 'nav-menu-item';

  return (
    <Container style={style}>
      <Row>
        <Title>
          Cost Sharing for YNAB
        </Title>

        <WorksWithYnabIcon
          src="works_with_ynab.svg"
          alt="Works with YNAB"
        />
      </Row>

      <NavMenu menuItemClassName={menuItemClassName}>
        {
          onLandingPage
            ? (
              <>
                <MenuItem
                  href={ynabAuthScreenLink}
                  className={menuItemClassName}
                >
                  <b>Start</b>
                </MenuItem>

                <Divider />

                <MenuItem
                  href="/cost-sharer"
                  className={menuItemClassName}
                >
                  Preview Without a YNAB Account
                </MenuItem>

                <Divider />
              </>
            )
            : (
              <>
                <MenuItem
                  href="/"
                  className={menuItemClassName}
                >
                  Home
                </MenuItem>
                <Divider />
              </>
            )
        }
        <MenuItem
          type="button"
          className={menuItemClassName}
          onClick={() => {
            if (onLandingPage) {
              document.getElementById('privacy-policy-container').scrollIntoView(true);
            } else {
              setActiveModal(modalNames.PRIVACY_POLICY);
            }
          }}
        >
          Privacy Policy
        </MenuItem>

        <Divider />

        <MenuItem
          href="https://github.com/chelseaSchmidt/cost-sharing-for-ynab/issues/new"
          target="_blank"
          rel="noreferrer"
          className={menuItemClassName}
        >
          Report a Bug
        </MenuItem>
      </NavMenu>
    </Container>
  );
};

Header.propTypes = {
  onLandingPage: PropTypes.bool,
  ynabAuthScreenLink: PropTypes.string,
  setActiveModal: PropTypes.func,
  style: PropTypes.object,
};

export default Header;
