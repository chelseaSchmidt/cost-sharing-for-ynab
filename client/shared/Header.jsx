import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
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

const Header = ({
  style = {},
  navMenuItems = [],
}) => {
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

      {
        !!navMenuItems.length && (
          <NavMenu
            menuItems={navMenuItems}
          />
        )
      }
    </Container>
  );
};

Header.propTypes = {
  navMenuItems: PropTypes.array,
  style: PropTypes.object,
};

export default Header;
