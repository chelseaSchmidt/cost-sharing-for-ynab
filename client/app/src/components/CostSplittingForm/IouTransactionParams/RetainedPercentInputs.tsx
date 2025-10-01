import { ChangeEvent } from 'react';
import styled from 'styled-components';
import colors from '../../../../../shared/colors';
import FieldSet from '../../FieldSet';
import LearnMoreParagraph from '../../LearnMoreParagraph';

const Row = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
`;

const SliderInput = styled.input`
  cursor: pointer;
`;

const NumberInput = styled.input`
  width: 50px;
  border: 1px solid ${colors.lightNeutralAccent};
  border-radius: 5px;
  padding: 10px 5px;
  font-size: inherit;
`;

const Label = styled.label`
  margin-left: 5px;
`;

const NoWrap = styled.span`
  white-space: nowrap;
`;

interface Props {
  retainedPercent: number;
  setRetainedPercent: (r: number) => void;
  handleInfoClick: () => void;
}

export default function RetainedPercentInputs({
  retainedPercent,
  setRetainedPercent,
  handleInfoClick,
}: Props) {
  const INPUT_ID = 'retained-percent';
  const [MIN, MAX] = [0, 100];

  const inputProps = {
    min: MIN,
    max: MAX,
    value: retainedPercent,
    onChange: (e: ChangeEvent<HTMLInputElement>) =>
      setRetainedPercent(constrainNumberInput(e.target.value, MIN, MAX)),
  };

  return (
    <FieldSet
      label="Enter your share of the costs."
      info={
        <LearnMoreParagraph
          prefix='The percentage owed to you will be subtracted from your expenses and added to your
            "IOU" account, via a single YNAB transaction.'
          handleInfoClick={handleInfoClick}
        />
      }
    >
      <Row>
        <SliderInput
          {...inputProps}
          type="range"
          id="retained-percent-slider"
          aria-label="Percent slider"
        />

        <NoWrap>
          <NumberInput {...inputProps} type="number" id={INPUT_ID} />
          <Label htmlFor={INPUT_ID}>%</Label>
        </NoWrap>
      </Row>
    </FieldSet>
  );
}

function constrainNumberInput(value: string, min: number, max: number): number {
  if (value === '') return 0;
  const num = Number(value);
  if (isNaN(num) || num < min) return min;
  if (num > max) return max;
  return num;
}
