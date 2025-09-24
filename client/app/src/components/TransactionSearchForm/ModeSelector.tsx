import { Mode } from '../../types';
import FieldSet from '../FieldSet';
import LearnMoreParagraph from '../LearnMoreParagraph';
import Switch, { Option } from '../Switch';

interface Props {
  mode: Mode;
  changeMode: (mode: Mode) => void;
  handleInfoClick: () => void;
}

export default function ModeSelector({ mode, changeMode, handleInfoClick }: Props) {
  return (
    <FieldSet
      label="Select where you record shared-cost transactions."
      info={
        <LearnMoreParagraph
          prefix='"Standard" is recommended for most use cases. The "Advanced" method enables automatic checking
      for misclassified transactions, but involves changing how you record transactions in YNAB.'
          handleInfoClick={handleInfoClick}
        />
      }
    >
      <Switch
        selected={mode}
        onChange={changeMode}
        options={(
          [
            [Mode.STANDARD, 'Standard:', 'In specific accounts'],
            [Mode.ADVANCED, 'Advanced:', 'In specific accounts and categories'],
          ] as const
        ).map(([value, title, desc]) => toOption({ value, title, desc }))}
      />
    </FieldSet>
  );
}

function toOption(args: { value: Mode; title: string; desc: string }): Option<Mode> {
  const { value, title, desc } = args;

  return {
    value,
    displayedContent: (
      <>
        <strong>{title}</strong>
        <div>{desc}</div>
      </>
    ),
  };
}
