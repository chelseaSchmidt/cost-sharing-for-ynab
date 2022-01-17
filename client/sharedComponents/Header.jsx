import React, { useState } from 'react';
import { push as Menu } from 'react-burger-menu';
import { func, string, object } from 'prop-types';
import styled from 'styled-components';
import './react-burger-menu.css';

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
  margin: 20px 2px;
  width: 100%;
  padding: 0 10px;
`;

const MenuClickArea = styled.div`
  width: 150px;
  height: 96px;
  position: fixed;
  right: 0;
  top: 0;
  cursor: pointer;
`;

const MenuItem = styled.a`
  text-decoration: none;
  color: #464b46;
  cursor: pointer;

  :hover, :visited:hover {
    color: #2f73b3;
  }

  :visited {
    color: #464b46;
  }
`;

const Header = ({
  setActiveModal = () => {},
  landingPageUrl,
  appEndpoint,
  style = {},
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const forwardClickToMenu = () => document.getElementById('react-burger-menu-btn').click();

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

      <MenuClickArea
        role="button"
        aria-label="Select menu"
        tabIndex={0}
        onClick={forwardClickToMenu}
        onKeyDown={forwardClickToMenu}
      />

      <Menu
        right
        isOpen={isMenuOpen}
        onStateChange={({ isOpen }) => setIsMenuOpen(isOpen)}
      >
        <MenuItem href="/">Home</MenuItem>

        <Divider />

        {
          landingPageUrl
          && (
            <>
              <MenuItem
                href={`https://app.youneedabudget.com/oauth/authorize?client_id=4ac8ca3c431ac99075e603496136606d7da8102f6178ce2796566b30c4659988&redirect_uri=${landingPageUrl}${appEndpoint}&response_type=token`}
                onClick={() => setIsMenuOpen(false)}
              >
                <b>Start</b>
              </MenuItem>

              <Divider />

              <MenuItem
                href="/cost-sharer"
                onClick={() => setIsMenuOpen(false)}
              >
                Preview Without a YNAB Account
              </MenuItem>

              <Divider />
            </>
          )
        }
        <MenuItem
          type="button"
          onClick={() => {
            if (landingPageUrl) {
              document.getElementById('privacy-policy-container').scrollIntoView(true);
            } else {
              setActiveModal('privacyPolicy');
            }
            setIsMenuOpen(false);
          }}
        >
          Privacy Policy
        </MenuItem>

        <Divider />

        <MenuItem
          href="https://github.com/chelseaSchmidt/cost-sharing-for-ynab/issues"
          target="_blank"
          rel="noreferrer"
          onClick={() => setIsMenuOpen(false)}
        >
          Report a Bug
        </MenuItem>
      </Menu>
    </Container>
  );
};

Header.propTypes = {
  setActiveModal: func,
  landingPageUrl: string,
  appEndpoint: string,
  style: object,
};

export default Header;
