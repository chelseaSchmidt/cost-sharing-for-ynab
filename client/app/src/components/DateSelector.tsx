import { CSSProperties, useEffect } from 'react';
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
  padding: 10px 5px;
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
  style?: CSSProperties;
  inputStyle?: CSSProperties;
  onChange: (value: string) => void;
  isLabelVisible?: boolean;
  min?: Date;
  hasError?: boolean;
}

const DateSelector = ({
  label,
  inputId,
  inputValue,
  style = {},
  inputStyle = {},
  onChange,
  isLabelVisible = true,
  min,
  hasError = false,
}: Props) => {
  const now = new Date();

  return (
    <Label htmlFor={inputId} style={style}>
      {isLabelVisible && (
        <>
          {label}
          <Spacer />
        </>
      )}

      <Input
        type="date"
        id={inputId}
        value={inputValue}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        style={hasError ? { color: 'red', ...inputStyle } : inputStyle}
        min={min ? toInputDateFormat(min) : undefined}
        max={toInputDateFormat(now)}
      />
    </Label>
  );
};

export default DateSelector;

function toInputDateFormat(date: Date): string {
  return new Intl.DateTimeFormat('en-CA').format(date).split('/').join('-');
}
