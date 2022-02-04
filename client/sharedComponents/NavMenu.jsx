import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { BackgroundOverlay } from '../appSrc/components/styledComponents'; // FIXME: move to shared directory

/**
 * FIXME: bugginess with menu pushing body off to the side instead of hiding off screen
 * Repro - change to mobile view
 *
 * FIXME: increase click area
 */

const Container = styled.div`
  position: absolute;
  right: 0;
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
  box-sizing: content-box;
  margin: 0;
  padding: 0;
  border: none;
  height: 30px;
  padding: 20px 40px;
  cursor: pointer;
`;

const ButtonBar = styled.div`
  background-color: white;
  border-radius: 5px;
  height: 5px;
  width: 30px;
`;

const menuWidth = '320px';

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  box-sizing: border-box;
  height: fit-content;
  width: ${menuWidth};
  background-color: white;
  padding: 20px;
  border-radius: 5px 0 0 5px;

  // drawer animation
  right: -${menuWidth};
  transition: right 0.4s;
  ${(props) => props.isOpen && 'right: 0;'}
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

const NavMenu = ({
  menuItems = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {
        isOpen && (
          <BackgroundOverlay onClick={closeMenu} />
        )
      }
      <Container>
        <Button
          onClick={toggleMenu}
          aria-label="Open navigation menu"
          tabIndex={0}
          type="button"
        >
          {
            _.range(0, 3).map((item) => (
              <ButtonBar key={`btn-bar-${item}`} />
            ))
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

          {
            menuItems.map((
              {
                text,
                attributes = {},
                style = {},
                onClick = () => {},
              },
              i,
            ) => {
              const isLastItem = i === menuItems.length - 1;

              return (
                <React.Fragment
                  key={text}
                >
                  <MenuItem
                    {...attributes} // eslint-disable-line react/jsx-props-no-spreading
                    style={style}
                    onClick={() => {
                      onClick();
                      closeMenu();
                    }}
                  >
                    {text}
                  </MenuItem>

                  {!isLastItem && <Divider />}
                </React.Fragment>
              );
            })
          }

          <MenuFooter />
        </Menu>
      </Container>
    </>
  );
};

NavMenu.propTypes = {
  menuItems: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    attributes: PropTypes.object,
    style: PropTypes.object,
    onClick: PropTypes.func,
  })),
};

export default NavMenu;
