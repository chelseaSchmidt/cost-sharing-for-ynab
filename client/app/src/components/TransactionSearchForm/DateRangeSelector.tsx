import { Moment } from 'moment';
import DateSelector from '../DateSelector';
import FieldSet from '../FieldSet';
import { RowOrColumn } from '../styledComponents';
import { convertDateToString, toDate } from '../utils/dateHelpers';

export interface DateRange {
  start: Moment;
  end: Moment;
}

interface Props {
  dateRange: DateRange;
  setDateRange: (d: DateRange) => void;
}

export default function DateRangeSelector({ dateRange, setDateRange }: Props) {
  return (
    <FieldSet
      label="Choose a date range to search in."
      info="This will limit transactions in your view to the specified date range."
    >
      <RowOrColumn>
        <DateSelector
          label="Start date:"
          id="transactions-start-date"
          value={convertDateToString(dateRange.start)}
          inputStyle={{ maxWidth: '200px' }}
          onChange={(value) => setDateRange({ ...dateRange, start: toDate(value) })}
        />

        <DateSelector
          label="End date:"
          id="transactions-end-date"
          value={convertDateToString(dateRange.end)}
          inputStyle={{ maxWidth: '200px' }}
          onChange={(value) => setDateRange({ ...dateRange, end: toDate(value, false) })}
        />
      </RowOrColumn>
    </FieldSet>
  );
}
