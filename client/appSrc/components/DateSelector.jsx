import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import breakpoints from '../../shared/breakpoints';

/* Styled Components */

const Label = styled.label`
  display: flex;
  align-items: center;

  @media (max-width: ${breakpoints.mobile}) {
    flex-direction: column;
    align-items: unset;
  }
`;

const Input = styled.input`
  cursor: text;

  ::-webkit-calendar-picker-indicator {
    cursor: pointer;
  }
`;

const Spacer = styled.div`
  width: 10px;

  @media (max-width: ${breakpoints.mobile}) {
    height: 10px;
  }
`;

/* Main Component */

const DateSelector = ({
  label,
  inputId,
  inputValue,
  inputStyle = {},
  onChange,
  isLabelVisible = true,
}) => {
  return (
    <Label htmlFor={inputId}>
      {isLabelVisible && label}
      {isLabelVisible && <Spacer />}
      <Input
        type="date"
        id={inputId}
        value={inputValue}
        onChange={(e) => onChange(e.target.value)}
        aria-label={isLabelVisible ? null : label}
        style={inputStyle}
      />
    </Label>
  );
};

DateSelector.propTypes = {
  label: PropTypes.string.isRequired,
  inputId: PropTypes.string.isRequired,
  inputValue: PropTypes.string.isRequired,
  inputStyle: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  isLabelVisible: PropTypes.bool,
};

export default DateSelector;
