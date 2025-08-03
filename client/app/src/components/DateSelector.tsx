import { CSSProperties } from 'react';
import styled from 'styled-components';
import breakpoints from '../../../shared/breakpoints';

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

  &::-webkit-calendar-picker-indicator {
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

interface Props {
  label: string;
  inputId: string;
  inputValue: string;
  inputStyle?: CSSProperties;
  onChange: (value: number) => void;
  isLabelVisible?: boolean;
}

const DateSelector = ({
  label,
  inputId,
  inputValue,
  inputStyle = {},
  onChange,
  isLabelVisible = true,
}: Props) => {
  return (
    <Label htmlFor={inputId}>
      {isLabelVisible && label}
      {isLabelVisible && <Spacer />}
      <Input
        type="date"
        id={inputId}
        value={inputValue}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={isLabelVisible ? '' : label}
        style={inputStyle}
      />
    </Label>
  );
};

export default DateSelector;
