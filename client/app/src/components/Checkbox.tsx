import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const Label = styled.label`
  cursor: pointer;
`;

const Input = styled.input`
  cursor: pointer;
`;

const StyledContainer = styled(Container);
const StyledLabel = styled(Label);
const StyledInput = styled(Input);

interface Props {
  id: string;
  label: string;
  checked: boolean;
  onChange?: (checked: boolean) => void;
  isLabelHidden?: boolean;
  styledComponents?: {
    Container?: typeof Container | typeof StyledContainer;
    Label?: typeof Label | typeof StyledLabel;
    Input?: typeof Input | typeof StyledInput;
  };
}

export default function Checkbox({
  id,
  label,
  checked,
  onChange,
  isLabelHidden = false,
  styledComponents,
}: Props) {
  return (
    <Container as={styledComponents?.Container}>
      {!isLabelHidden && (
        <Label htmlFor={id} as={styledComponents?.Label}>
          {label}
        </Label>
      )}

      <Input
        id={id}
        as={styledComponents?.Input}
        type="checkbox"
        checked={checked}
        onChange={onChange ? (e) => onChange(e.target.checked) : undefined}
        readOnly={!onChange}
        aria-label={isLabelHidden ? label : undefined}
      />
    </Container>
  );
}
