import { Moment } from 'moment';
import DateSelector from '../../DateSelector';
import { FormControlWrapper } from '../../styledComponents';
import { convertDateToString, toDate } from '../../utils/dateHelpers';

interface Props {
  date: Moment;
  setDate: (d: Moment) => void;
}

export default function IouDateSelector({ date, setDate }: Props) {
  return (
    <FormControlWrapper>
      <DateSelector
        label="Select a date for the IOU transaction."
        id="iou-transaction-date"
        value={convertDateToString(date)}
        onChange={(value) => setDate(toDate(value))}
        style={{
          flexDirection: 'column',
          gap: '10px',
          alignItems: 'unset',
          width: 'fit-content',
        }}
      />
    </FormControlWrapper>
  );
}
