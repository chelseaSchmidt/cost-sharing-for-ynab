import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

/* Styled Components */

const Label = styled.label``;

const Input = styled.input`
  margin: 10px;
  cursor: text;

  ::-webkit-calendar-picker-indicator {
    cursor: pointer;
  }
`;

/* Main Component */

const DateSelector = ({
  label,
  inputId,
  inputValue,
  onChange,
  isLabelVisible = true,
}) => {
  return (
    <Label htmlFor={inputId}>
      {isLabelVisible && label}
      <Input
        type="date"
        id={inputId}
        value={inputValue}
        onChange={(e) => onChange(e.target.value)}
        aria-label={isLabelVisible ? null : label}
      />
    </Label>
  );
};

DateSelector.propTypes = {
  label: PropTypes.string.isRequired,
  inputId: PropTypes.string.isRequired,
  inputValue: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  isLabelVisible: PropTypes.bool,
};

export default DateSelector;
