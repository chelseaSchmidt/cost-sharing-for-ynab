import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

/* Styled Components */

const Container = styled.div``;

const Select = styled.select`
  cursor: pointer;

  :focus {
    outline: none;
  }
`;

/* Main Component */

const AccountSelector = ({
  accounts,
  setAccountId,
  optionIdPrefix = '',
}) => {
  return (
    <Container>
      <Select
        onChange={(e) => setAccountId(e.target.value)}
        defaultValue="none"
      >
        <option disabled value="none">
          -- select an account --
        </option>

        {
          accounts.map(({ name, id }) => (
            <option
              id={`${optionIdPrefix}-${id}`}
              key={`${optionIdPrefix}-${id}`}
              value={id}
            >
              {name}
            </option>
          ))
        }
      </Select>
    </Container>
  );
};

AccountSelector.propTypes = {
  accounts: PropTypes.array.isRequired,
  setAccountId: PropTypes.func.isRequired,
  optionIdPrefix: PropTypes.string,
};

export default AccountSelector;
