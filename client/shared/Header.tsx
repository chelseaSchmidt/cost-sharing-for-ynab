import styled from 'styled-components';
import NavMenu, { MenuItem } from './NavMenu';
import breakpoints from './breakpoints';
import { CSSProperties } from 'react';
import colors from './colors';
import zIndices from './zIndices';

export const HEADER_MAX_HEIGHT = 100;

const Container = styled.header`
  box-sizing: border-box;
  display: flex;
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
  }
`;

const MainContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const Title = styled.h1`
  margin-right: 10px;
  font-size: 30px;
  letter-spacing: 1px;
  font-weight: 800;
  text-shadow: 0 1px 1px #545353;
  min-width: 140px;
  text-align: center;

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 20px;
    margin-left: 10px;
  }
`;

const WorksWithYnabIconLarge = styled.img`
  width: 144px;
  height: 57px;

  @media (max-width: ${breakpoints.mobile}) {
    display: none;
  }
`;

const WorksWithYnabIconSmall = styled.img`
  width: 80px;
  height: 32px;

  @media (min-width: ${breakpoints.mobile}) {
    display: none;
  }

  @media (max-width: ${breakpoints.tiny}) {
    display: none;
  }
`;

interface Props {
  navMenuItems: MenuItem[];
  style?: CSSProperties;
}

const Header = ({ style = {}, navMenuItems }: Props) => {
  const ynabIconAttributes = {
    src: 'works_with_ynab.svg',
    alt: 'Works with YNAB',
  };

  return (
    <Container style={style}>
      <MainContent>
        <WorksWithYnabIconSmall {...ynabIconAttributes} />

        <Title>Cost Sharing for YNAB</Title>

        <WorksWithYnabIconLarge {...ynabIconAttributes} />
      </MainContent>

      {!!navMenuItems?.length && <NavMenu menuItems={navMenuItems} />}
    </Container>
  );
};

export default Header;
