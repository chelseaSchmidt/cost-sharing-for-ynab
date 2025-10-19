import { useState } from 'react';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import sumBy from 'lodash/sumBy';
import { Moment } from 'moment';
import styled from 'styled-components';
import colors from '../../../../../shared/colors';
import { FlexColumnCentered } from '../../../../../shared/styledComponents';
import { MixedTransaction, Transaction, TransactionPayload } from '../../../types';
import Popup from '../../Popup';
import { SectionHeader, SectionTile } from '../../styledComponents';
import {
  convertDateToString,
  getLastDateOfLastMonth,
  stringToReadableDate,
} from '../../utils/dateHelpers';
import { toUsd } from '../../utils/general';
import { createTransaction } from '../../utils/networkRequests';
import IouDateSelector from './IouDateSelector';
import RetainedPercentInputs from './RetainedPercentInputs';
import SubmitButton from './SubmitButton';

type CategorySums = Record<string, number>;

const TransactionDetails = styled(FlexColumnCentered)`
  box-sizing: border-box;
  width: 100%;
  margin-top: 10px;
  border-radius: 3px;
  box-shadow: 0 0 2px white;
  color: ${colors.defaultFont};
`;

const Detail = styled.div`
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  border-bottom: 1px solid white;
  padding: 5px 20px;
  background: ${colors.successLight};

  &:first-of-type {
    font-weight: bold;
    border-radius: 3px 3px 0 0%;
  }

  &:last-of-type {
    border-bottom: none;
    border-radius: 0 0 3px 3px;
  }
`;

interface Props {
  accountId: string;
  transactions: MixedTransaction[];
  selectedIds: Set<string>;
  resetForm: () => void;
  handleInfoClick: () => void;
  handleError: (e: unknown) => void;
}

export default function IouTransactionParams({
  accountId,
  transactions,
  selectedIds,
  resetForm,
  handleInfoClick,
  handleError,
}: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [transactionDate, setTransactionDate] = useState(getLastDateOfLastMonth());
  const [retainedPercent, setRetainedPercent] = useState(50);
  const [createdTransaction, setCreatedTransaction] = useState<Transaction | null>(null);

  const isSubmitDisabled = !selectedIds.size || !accountId;

  const submit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const createdTransaction = await createTransaction(
        toTransactionPayload(
          accountId,
          transactionDate,
          groupOwedAmountsByCategory(transactions, selectedIds, retainedPercent),
        ),
      );

      if (createdTransaction) {
        setCreatedTransaction(createdTransaction);
        resetForm();
      } else {
        handleError(null);
      }
    } catch (error) {
      handleError(error);
    }

    setSubmitting(false);
  };

  return (
    <SectionTile>
      <SectionHeader>Split the Costs</SectionHeader>

      <RetainedPercentInputs
        retainedPercent={retainedPercent}
        setRetainedPercent={setRetainedPercent}
        handleInfoClick={handleInfoClick}
      />

      <IouDateSelector date={transactionDate} setDate={setTransactionDate} />

      <SubmitButton
        submitting={submitting}
        submit={submit}
        disabled={isSubmitDisabled}
        selectedIds={selectedIds}
        accountId={accountId}
      />

      {createdTransaction && (
        <Popup theme="success" onClose={() => setCreatedTransaction(null)}>
          Success! Your IOU transaction was created.
          <TransactionDetails>
            {[
              toUsd(createdTransaction.amount * -1),
              stringToReadableDate(createdTransaction.date),
              createdTransaction.account_name,
            ].map((detail) => detail && <Detail key={detail}>{detail}</Detail>)}
          </TransactionDetails>
        </Popup>
      )}
    </SectionTile>
  );
}

function groupOwedAmountsByCategory(
  transactions: MixedTransaction[],
  selectedIds: Set<string>,
  retainedPercent: number,
): CategorySums {
  return reduce<CategorySums, CategorySums>(
    sumCategories(transactions, selectedIds),
    (accum, amount, categoryId) => {
      accum[categoryId] = Math.round(amount * ((100 - retainedPercent) / 100));
      return accum;
    },
    {},
  );
}

function sumCategories(transactions: MixedTransaction[], selectedIds: Set<string>): CategorySums {
  return reduce<{ [k: string]: MixedTransaction[] }, CategorySums>(
    groupByCategory(filterOutUnselected(transactions, selectedIds)),
    (accum, categoryTransactions, categoryId) => {
      accum[categoryId] = sumBy(categoryTransactions, 'amount');
      return accum;
    },
    {},
  );
}

function groupByCategory(transactions: MixedTransaction[]): Record<string, MixedTransaction[]> {
  return groupBy(transactions, 'category_id');
}

function filterOutUnselected(transactions: MixedTransaction[], selectedIds: Set<string>) {
  return transactions.filter(({ id }) => selectedIds.has(id));
}

function toTransactionPayload(
  accountId: string,
  date: Moment,
  owedAmounts: CategorySums,
): TransactionPayload {
  return {
    account_id: accountId,
    date: convertDateToString(date),
    amount: reduce(owedAmounts, (sum, amt) => sum - amt, 0),
    payee_id: null,
    payee_name: null,
    category_id: null,
    memo: null,
    cleared: 'uncleared',
    approved: true,
    flag_color: null,
    import_id: null,
    subtransactions: map(owedAmounts, (amount, category_id) => ({
      amount: -amount,
      payee_id: null,
      payee_name: 'Shared Costs',
      category_id,
      memo: null,
    })),
  };
}
