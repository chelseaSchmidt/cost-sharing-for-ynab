import { ReactNode } from 'react';
import InfoIcon from './InfoIcon';
import { FormControlWrapper, Label, LabelContainer } from './styledComponents';

interface Props {
  label: string;
  info?: ReactNode;
  children: ReactNode;
}

export default function FieldSet({ label, info, children }: Props) {
  return (
    <FormControlWrapper as="fieldset">
      <LabelContainer>
        <Label as="legend">{label}</Label>
        {info && <InfoIcon tooltipContent={info} />}
      </LabelContainer>

      {children}
    </FormControlWrapper>
  );
}
