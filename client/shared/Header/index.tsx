import { CSSProperties } from 'react';
import styled from 'styled-components';
import breakpoints from '../breakpoints';
import colors from '../colors';
import zIndices from '../zIndices';
import { LEFT_ALIGN_BREAKPOINT, NO_LOGO_BREAKPOINT } from './constants';
import DrawerMenu, { MenuProps } from './DrawerMenu';

export const HEADER_MAX_HEIGHT = 100;

const Container = styled.header`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  color: white;
  background-color: ${colors.primary};
  margin: 0;
  margin-bottom: 50px;
  padding: 10px 20px;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.5);
  z-index: ${zIndices.header};
  max-height: ${HEADER_MAX_HEIGHT}px;

  @media (max-width: ${breakpoints.mobile}) {
    justify-content: space-between;
    padding: 10px;
  }
`;

const MainContent = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0 70px;
  gap: 10px;

  @media (max-width: ${breakpoints.mobile}) {
    flex-direction: row-reverse;
    padding: 0 40px;
  }

  @media (max-width: ${LEFT_ALIGN_BREAKPOINT}) {
    padding: 0;
    justify-content: start;
  }
`;

const Title = styled.h1`
  all: unset;
  min-width: 140px;
  margin: 15px 0;
  font-size: 28px;
  letter-spacing: 1px;
  font-weight: 800;
  text-shadow: 0 1px 1px #545353;

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 20px;
  }
`;

const WorksWithYnabIcon = styled.img`
  width: 144px;
  height: 57px;

  @media (max-width: ${breakpoints.mobile}) {
    width: 80px;
    height: 32px;
  }

  @media (max-width: ${NO_LOGO_BREAKPOINT}) {
    display: none;
  }
`;

export type HeaderProps = MenuProps & { style?: CSSProperties };

export default function Header({ menuItems, isMenuOpen, setIsMenuOpen, style }: HeaderProps) {
  return (
    <Container style={style}>
      <MainContent inert={isMenuOpen}>
        <Title>Cost Sharing for YNAB</Title>
        <WorksWithYnabIcon src="works_with_ynab.svg" alt="Works with YNAB" />
      </MainContent>

      <DrawerMenu menuItems={menuItems} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
    </Container>
  );
}
