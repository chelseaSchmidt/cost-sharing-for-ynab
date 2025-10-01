import React, { CSSProperties, useState } from 'react';
import range from 'lodash/range';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import breakpoints from './breakpoints';
import colors from './colors';
import { BackgroundOverlay } from './styledComponents';
import zIndices from './zIndices';

const MENU_WIDTH = '320px';

const Container = styled.div`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(0, -50%);
  z-index: ${zIndices.headerMenuButton};
  font-family: inherit;

  @media (max-width: ${breakpoints.mobile}) {
    transform: unset;
    position: relative;
    display: flex;
    align-items: center;
  }
`;

const Button = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: transparent;
  box-sizing: content-box;
  margin: 0;
  border: none;
  height: 30px;
  padding: 20px 40px;
  cursor: pointer;

  @media (max-width: ${breakpoints.mobile}) {
    padding: 5px;
  }
`;

const ButtonBar = styled.div`
  background-color: white;
  border-radius: 5px;
  height: 5px;
  width: 30px;
`;

const Menu = styled.div<{ $isOpen: boolean }>`
  z-index: ${zIndices.modal};
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 10px;
  box-sizing: border-box;
  width: ${MENU_WIDTH};
  max-width: 100vw;
  background-color: white;
  padding: 20px;
  border-radius: 5px 0 0 5px;

  // drawer animation
  right: -${MENU_WIDTH};
  transition: right 0.4s;
  ${(props) => props.$isOpen && 'right: 0;'}
`;

const MenuHeader = styled.div`
  display: flex;
  justify-content: flex-end;
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

  &:hover {
    color: ${colors.primary};
  }
`;

const Divider = styled.div`
  border-top: 1px solid ${colors.lightNeutralAccent};
  width: 100%;
`;

const MenuItem = styled.a`
  all: unset;

  text-decoration: none;
  color: inherit;
  text-align: left;
  padding: 20px 10px;
  border-radius: 2px;
  font-size: 1.15em;
  cursor: pointer;

  &:hover,
  &:visited:hover {
    color: ${colors.primary};
    background-color: ${colors.lightNeutralBg};
  }

  &:visited {
    color: inherit;
  }

  &:focus-visible {
    outline: 1px solid ${colors.primary};
    border-radius: 5px;
  }
`;

export interface MenuItem {
  text: string;
  attributes: React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  > & { as?: 'button' };
  style?: CSSProperties;
  onClick?: () => void;
}

interface Props {
  menuItems: MenuItem[];
}

export default function NavMenu({ menuItems = [] }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {isOpen &&
        ReactDOM.createPortal(
          <BackgroundOverlay
            onClick={closeMenu}
            onKeyUp={(e) => e.key === 'Escape' && closeMenu()}
            role="button"
            aria-label="Exit"
            tabIndex={0}
          />,
          document.body,
        )}

      <Container>
        <Button onClick={toggleMenu} aria-label="Open navigation menu" tabIndex={0} type="button">
          {range(0, 3).map((value) => (
            <ButtonBar key={`btn-bar-${value}`} />
          ))}
        </Button>

        {ReactDOM.createPortal(
          <Menu $isOpen={isOpen}>
            <MenuHeader>
              <ExitButton
                role="button"
                aria-label="Exit navigation menu"
                onClick={closeMenu}
                tabIndex={0}
              >
                X
              </ExitButton>
            </MenuHeader>

            {menuItems.map(({ text, attributes = {}, style = {}, onClick = () => {} }, i) => {
              const isLastItem = i === menuItems.length - 1;

              return (
                <React.Fragment key={text}>
                  <MenuItem
                    {...attributes}
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
            })}

            <MenuFooter />
          </Menu>,
          document.body,
        )}
      </Container>
    </>
  );
}
