import { CSSProperties } from 'react';
import styled from 'styled-components';
import breakpoints from '../breakpoints';
import colors from '../colors';
import { APP_MIN_WIDTH } from '../constants';
import { FlexRowAllCentered } from '../styledComponents';
import zIndices from '../zIndices';
import { headerBreakpoints } from './constants';
import DrawerMenu, { MenuProps } from './DrawerMenu';

export const HEADER_MAX_HEIGHT = 100;

const Container = styled.header`
  box-sizing: border-box;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  color: white;
  background: ${colors.primary};
  margin: 0;
  padding: 10px 20px;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.5);
  z-index: ${zIndices.header};
  max-height: ${HEADER_MAX_HEIGHT}px;

  @media (max-width: ${breakpoints.mobile}) {
    justify-content: space-between;
    padding: 10px;
  }
`;

const MainContent = styled(FlexRowAllCentered)`
  box-sizing: border-box;
  width: 100%;
  padding: 0 70px;
  gap: 10px;

  @media (max-width: ${breakpoints.mobile}) {
    flex-direction: row-reverse;
    padding: 0 40px;
  }

  @media (max-width: ${headerBreakpoints.sm}) {
    padding: 0;
    justify-content: start;
  }
`;

const Title = styled.h1`
  all: unset;
  margin: 15px 0;
  font-size: 28px;
  letter-spacing: 1px;
  font-weight: 800;
  text-shadow: 0 1px 1px #545353;

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 20px;
  }

  @media (max-width: ${headerBreakpoints.xs}) {
    display: flex;
    flex-direction: column;
  }

  @media (max-width: ${breakpoints.tiny}) {
    font-size: 16px;
  }
`;

const ForYnab = styled.span`
  @media (max-width: ${headerBreakpoints.xs}) {
    font-size: 15px;
  }

  @media (max-width: ${breakpoints.tiny}) {
    font-size: 12px;
  }
`;

const WorksWithYnabIcon = styled.img`
  --icon-lg-width: 144px;
  --icon-lg-height: calc(var(--icon-lg-width) / 2.526);

  width: var(--icon-lg-width);
  height: var(--icon-lg-height);

  @media (max-width: ${breakpoints.mobile}) {
    --icon-md-divisor: 1.5;
    width: calc(var(--icon-lg-width) / var(--icon-md-divisor));
    height: calc(var(--icon-lg-height) / var(--icon-md-divisor));
  }

  @media (max-width: ${breakpoints.tiny}) {
    --icon-sm-divisor: 2;
    width: calc(var(--icon-lg-width) / var(--icon-sm-divisor));
    height: calc(var(--icon-lg-height) / var(--icon-sm-divisor));
  }

  @media (max-width: ${headerBreakpoints.xxs}) {
    --icon-xs-divisor: 2.6;
    width: calc(var(--icon-lg-width) / var(--icon-xs-divisor));
    height: calc(var(--icon-lg-height) / var(--icon-xs-divisor));
  }

  @media (max-width: ${APP_MIN_WIDTH}) {
    display: none;
  }
`;

export type HeaderProps = MenuProps & { style?: CSSProperties };

export default function Header({ menuItems, isMenuOpen, setIsMenuOpen, style }: HeaderProps) {
  return (
    <Container style={style}>
      <MainContent inert={isMenuOpen}>
        <Title>
          Cost Sharing <ForYnab>for YNAB</ForYnab>
        </Title>

        <WorksWithYnabIcon src="works_with_ynab.svg" alt="Works with YNAB" />
      </MainContent>

      <DrawerMenu menuItems={menuItems} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
    </Container>
  );
}
