import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { BackgroundOverlay } from '../appSrc/components/styledComponents'; // FIXME: move to shared directory

const menuWidth = 320;
const menuButtonRightPosition = 20;

/**
 * FIXME: bugginess with menu pushing body off to the side instead of hiding off screen
 * Repro - change to mobile view
 *
 * FIXME: weird class name prop pass through
 *
 * FIXME: increase click area
 */

const Container = styled.div`
  position: absolute;
  right: ${menuButtonRightPosition}px;
  top: 50%;
  transform: translate(0, -50%);
  z-index: 6;
  background-color: transparent;
  border: none;
  font-family: inherit;
`;

const Button = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: transparent;
  margin: none;
  padding: none;
  border: none;
  height: 30px;
  cursor: pointer;
`;

const ButtonBar = styled.div`
  background-color: white;
  border-radius: 5px;
  height: 5px;
  width: 30px;
`;

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  box-sizing: border-box;
  height: fit-content;
  width: ${menuWidth}px;
  background-color: white;
  padding: 20px;
  border-radius: 5px 0 0 5px;

  // drawer animation
  right: -${menuWidth + menuButtonRightPosition}px;
  transition: right 0.4s;
  ${(props) => props.isOpen && `right: -${menuButtonRightPosition}px;`}
`;

const MenuHeader = styled.div`
  display: flex;
  justify-content: right;
  width: 100%;
  height: 18px;
  font-size: 18px;
`;

const MenuFooter = styled.div`
  display: flex;
  width: 100%;
  height: 18px;
`;

const ExitButton = styled.div`
  display: flex;
  justify-content: right;
  padding-left: 20px;
  font-family: Arial;
  color: black;
  opacity: 50%;
  cursor: pointer;

  :hover {
    color: #2f73b3;
  }
`;

const NavMenu = ({
  menuItemClassName,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuItemClassNamePattern = new RegExp(menuItemClassName);
  const closeMenu = () => setIsOpen(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {
        isOpen && (
          <BackgroundOverlay onClick={closeMenu} />
        )
      }
      <Container
        onClick={(e) => {
          if (menuItemClassNamePattern.test(e.target.className)) {
            closeMenu();
          }
        }}
      >
        <Button
          onClick={toggleMenu}
          aria-label="Open navigation menu"
          tabIndex={0}
          type="button"
        >
          {
            _.range(0, 3).map((item) => <ButtonBar key={`btn-bar-${item}`} />)
          }
        </Button>
        <Menu isOpen={isOpen}>
          <MenuHeader>
            <ExitButton
              type="button"
              aria-label="Exit navigation menu"
              onClick={closeMenu}
              tabIndex={0}
            >
              X
            </ExitButton>
          </MenuHeader>

          {children}

          <MenuFooter />
        </Menu>
      </Container>
    </>
  );
};

NavMenu.propTypes = {
  menuItemClassName: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default NavMenu;
