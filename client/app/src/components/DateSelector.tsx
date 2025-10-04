import { CSSProperties } from 'react';
import styled from 'styled-components';
import breakpoints from '../../../shared/breakpoints';
import colors from '../../../shared/colors';

/* Styled Components */

const Container = styled.div`
  display: flex;
  align-items: center;
  margin: 0 10px 0 0;

  @media (max-width: ${breakpoints.mobile}) {
    margin: 0 0 10px 0;
  }

  @media (max-width: ${breakpoints.tiny}) {
    flex-direction: column;
    align-items: unset;
  }
`;

const Label = styled.label`
  margin: 0 5px 0 0;

  @media (max-width: ${breakpoints.tiny}) {
    margin: 0 0 5px 0;
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

/* Main Component */

interface Props {
  label: string;
  id: string;
  value: string;
  style?: CSSProperties;
  inputStyle?: CSSProperties;
  onChange: (value: string) => void;
  isLabelVisible?: boolean;
}

export default function DateSelector({
  label,
  id,
  value,
  style = {},
  inputStyle = {},
  onChange,
  isLabelVisible = true,
}: Props) {
  return (
    <Container style={style}>
      {isLabelVisible && <Label htmlFor={id}>{label}</Label>}

      <Input
        type="date"
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={isLabelVisible ? undefined : label}
        style={inputStyle}
        max={new Intl.DateTimeFormat('en-CA').format(new Date()).split('/').join('-')}
      />
    </Container>
  );
}
