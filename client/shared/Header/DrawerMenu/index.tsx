import { CSSProperties, Dispatch, SetStateAction } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import Button, { ButtonProps } from '../../Button';
import colors from '../../colors';
import useEscapeListener from '../../hooks/useEscapeListener';
import ExitIcon from '../../icons/ExitIcon';
import Link, { LinkProps } from '../../Link';
import { BackgroundOverlay, FlexColumn, FlexRow } from '../../styledComponents';
import zIndices from '../../zIndices';
import { headerBreakpoints } from '../constants';
import IconButton from './IconButton';

const ITEM_CLASS = 'menu-item';

const Container = styled.nav`
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

  @media (max-width: ${headerBreakpoints.sm}) {
    position: relative;
    top: unset;
    right: unset;
    margin: 0;
  }
`;

const Menu = styled(FlexColumn)<{ $isOpen: boolean }>`
  --menu-width: 320px;

  z-index: ${zIndices.modal};
  position: fixed;
  box-sizing: border-box;
  top: 0;
  width: var(--menu-width);
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
  right: calc(var(--menu-width) * -1);
  transition: right 0.4s;
  ${(props) => props.$isOpen && 'right: 0;'}
`;

const MenuControls = styled(FlexRow)`
  justify-content: flex-end;
  width: 100%;
`;

const ExitButton = styled(Button)`
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

  useEscapeListener(closeMenu, isMenuOpen);

  return (
    <Container>
      <IconButton toggleMenu={() => setIsMenuOpen((prev) => !prev)} isMenuOpen={isMenuOpen} />

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
              <ExitButton aria-label="Exit menu" onClick={closeMenu}>
                <ExitIcon size={14} />
              </ExitButton>
            </MenuControls>

            {menuItems.map(({ type, key, props }) => {
              const style: CSSProperties = { textAlign: 'left', ...props.style };

              const requiredProps = {
                style,
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
    </Container>
  );
}
