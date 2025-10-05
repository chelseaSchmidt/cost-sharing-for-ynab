import { useEffect } from 'react';
import { Moment } from 'moment';
import styled from 'styled-components';
import breakpoints from '../../../../shared/breakpoints';
import DateSelector from '../DateSelector';
import FieldSet from '../FieldSet';
import { RowOrColumn } from '../styledComponents';
import { convertDateToString, toDate } from '../utils/dateHelpers';

const MessagePositioner = styled.div`
  position: relative;
`;

const ErrorMessage = styled.div`
  position: absolute;
  line-height: 1em;
  height: 1em;
  color: red;
  margin-top: 10px;

  @media (max-width: ${breakpoints.tiny}) {
    margin-top: 0;
  }
`;

export type DateError = string | null;

export interface DateRange {
  start: Moment;
  end: Moment;
}

interface Props {
  dateRange: DateRange;
  setDateRange: (d: DateRange) => void;
  dateError: DateError;
  setDateError: (error: DateError) => void;
}

export default function DateRangeSelector({
  dateRange,
  setDateRange,
  dateError,
  setDateError,
}: Props) {
  useEffect(
    function validate() {
      if (dateRange.end < dateRange.start) {
        setDateError('End date must be after start date');
      } else {
        setDateError(null);
      }
    },
    [dateRange.start, dateRange.end],
  );

  const inputStyle = {
    maxWidth: '200px',
    border: dateError ? '1px solid red' : undefined,
  };

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
          inputStyle={inputStyle}
          onChange={(value) => setDateRange({ ...dateRange, start: toDate(value) })}
        />

        <DateSelector
          label="End date:"
          id="transactions-end-date"
          value={convertDateToString(dateRange.end)}
          inputStyle={inputStyle}
          onChange={(value) => setDateRange({ ...dateRange, end: toDate(value, false) })}
        />
      </RowOrColumn>

      <MessagePositioner>
        <ErrorMessage>{dateError}</ErrorMessage>
      </MessagePositioner>
    </FieldSet>
  );
}
