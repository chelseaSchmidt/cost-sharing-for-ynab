import { Dispatch, SetStateAction } from 'react';
import range from 'lodash/range';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import breakpoints from '../breakpoints';
import Button, { ButtonProps } from '../Button';
import colors from '../colors';
import useEscapeListener from '../hooks/useEscapeListener';
import DeleteIcon from '../icons/DeleteIcon';
import Link, { LinkProps } from '../Link';
import { BackgroundOverlay, FlexColumn, FlexRow } from '../styledComponents';
import zIndices from '../zIndices';
import { LEFT_ALIGN_BREAKPOINT } from './constants';

const ITEM_CLASS = 'menu-item';

const IconContainer = styled.nav`
  z-index: ${zIndices.headerMenuButton};
  position: absolute;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  right: 0;
  height: 100%;
  margin-right: 10px;

  @media (max-width: ${LEFT_ALIGN_BREAKPOINT}) {
    position: relative;
    top: unset;
    right: unset;
    margin: 0 0 0 10px;
  }
`;

const IconButton = styled.button`
  box-sizing: unset;
  box-shadow: unset;
  background: unset;

  --default-size: 30px;
  --mobile-size: 20px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: var(--default-size);
  padding: 20px;

  div {
    height: 5px;
    width: var(--default-size);
  }

  @media (max-width: ${breakpoints.mobile}) {
    height: var(--mobile-size);
    padding: 10px;

    div {
      height: 4px;
      width: var(--mobile-size);
    }
  }

  &:hover {
    div {
      background: ${colors.primary};
    }
  }
`;

const IconBar = styled.div`
  background: white;
  border-radius: 5px;
`;

const Menu = styled(FlexColumn)<{ $isOpen: boolean }>`
  z-index: ${zIndices.modal};
  position: fixed;
  box-sizing: border-box;
  top: 0;
  width: 320px;
  max-width: 100vw;
  background-color: white;
  padding: 10px 20px 40px;
  border-radius: 5px 0 0 5px;

  .${ITEM_CLASS} {
    box-shadow: unset;
    background: unset;
    justify-content: unset;
    font-family: inherit;
    text-decoration: none;
    color: inherit;
    padding: 20px 10px;
    border-radius: 2px;
    font-size: 16px;
    border-bottom: 1px solid ${colors.lightNeutralAccent};

    &:last-child {
      border-bottom: none;
    }

    &:hover,
    &:visited:hover {
      color: ${colors.primary};
      background: ${colors.lightNeutralBg};
    }

    &:visited {
      color: inherit;
    }

    &:focus-visible {
      outline: 1px solid ${colors.primary};
      border-radius: 5px;
    }
  }

  /* DRAWER ANIMATION */
  right: -100%;
  transition: right 0.4s;
  ${(props) => props.$isOpen && 'right: 0;'}
`;

const MenuControls = styled(FlexRow)`
  justify-content: flex-end;
  width: 100%;
`;

const ExitButton = styled.button`
  box-shadow: unset;
  background: unset;
  height: 30px;
  width: 30px;
  border-radius: 5px;
  margin-right: -10px;
  padding: 0;

  &:hover {
    background: ${colors.lightNeutralBg};
  }
`;

interface ButtonItem {
  type: 'button';
  key: string;
  props: ButtonProps & { onClick: () => void };
}

interface LinkItem {
  type: 'link';
  key: string;
  props: LinkProps & { onClick?: never };
}

export type MenuItem = ButtonItem | LinkItem;

export interface MenuProps {
  menuItems: MenuItem[];
  isMenuOpen: boolean;
  setIsMenuOpen: Dispatch<SetStateAction<boolean>>;
}

export default function DrawerMenu({ menuItems, isMenuOpen, setIsMenuOpen }: MenuProps) {
  const closeMenu = () => setIsMenuOpen(false);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  useEscapeListener(closeMenu, isMenuOpen);

  return (
    <IconContainer>
      <Button
        onClick={toggleMenu}
        aria-label="Open menu"
        styledComponent={IconButton}
        inert={isMenuOpen}
      >
        {range(0, 3).map((bar) => (
          <IconBar key={bar} />
        ))}
      </Button>

      {createPortal(
        <>
          <BackgroundOverlay
            role="button"
            aria-label="Exit"
            tabIndex={0}
            onClick={closeMenu}
            style={isMenuOpen ? undefined : { display: 'none' }}
          />

          <Menu $isOpen={isMenuOpen}>
            <MenuControls>
              <Button aria-label="Exit menu" onClick={closeMenu} styledComponent={ExitButton}>
                <DeleteIcon size={14} />
              </Button>
            </MenuControls>

            {menuItems.map(({ type, key, props }) => {
              const requiredProps = {
                className: ITEM_CLASS,
                onClick: () => {
                  props?.onClick?.();
                  closeMenu();
                },
              };

              return type === 'button' ? (
                <Button key={key} {...props} {...requiredProps} />
              ) : (
                <Link key={key} {...props} {...requiredProps} />
              );
            })}
          </Menu>
        </>,
        document.body,
      )}
    </IconContainer>
  );
}
