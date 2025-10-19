import Button from '../../../../../shared/Button';
import InfoIcon from '../../InfoIcon';
import { SubmittingSpinner } from '../../styledComponents';

interface Props {
  submitting: boolean;
  submit: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void>;
  disabled: boolean;
  selectedIds: Set<string>;
  accountId: string;
}

export default function SubmitButton({
  submitting,
  submit,
  disabled,
  selectedIds,
  accountId,
}: Props) {
  return (
    <Button type="submit" onClick={submit} disabled={disabled}>
      {submitting ? (
        <SubmittingSpinner role="progressbar" aria-label="Submitting" />
      ) : disabled ? (
        <>
          Split costs&nbsp;
          <InfoIcon color="white" tooltipContent={getTooltip(selectedIds, accountId)} />
        </>
      ) : (
        'Split Costs'
      )}
    </Button>
  );
}

function getTooltip(selectedIds: Set<string>, accountId: string): string {
  return !selectedIds.size && !accountId
    ? 'Please select an IOU account and at least one transaction to split'
    : !selectedIds.size
    ? 'Please select at least one transaction to split'
    : !accountId
    ? 'Please select an IOU account'
    : '';
}
