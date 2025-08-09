import { CSSProperties } from 'react';
import styled from 'styled-components';
import breakpoints from '../../../shared/breakpoints';
import colors from '../../../shared/colors';

/* Styled Components */

const Label = styled.label`
  display: flex;
  align-items: center;
  white-space: nowrap;

  @media (max-width: ${breakpoints.tiny}) {
    flex-direction: column;
  }
`;

const Input = styled.input`
  cursor: text;
  border: 1px solid ${colors.lightNeutralAccent};
  border-radius: 5px;
  padding: 5px;
  font-size: inherit;

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
  onChange: (value: string) => void;
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
        onChange={(e) => onChange(e.target.value)}
        aria-label={isLabelVisible ? '' : label}
        style={inputStyle}
      />
    </Label>
  );
};

export default DateSelector;
