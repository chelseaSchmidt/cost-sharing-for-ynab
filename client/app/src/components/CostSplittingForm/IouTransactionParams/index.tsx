import { useState } from 'react';
import _ from 'lodash';
import styled from 'styled-components';
import breakpoints from '../../../../../shared/breakpoints';
import colors from '../../../../../shared/colors';
import { Button, Hyperlink } from '../../../../../shared/styledComponents';
import { Account, ModalName, Transaction, TransactionPayload } from '../../../types';
import BudgetAutocomplete from '../../BudgetAutocomplete';
import DateSelector from '../../DateSelector';
import InfoIcon from '../../InfoIcon';
import Popup from '../../Popup';
import { SectionHeader, SectionTile, SubmittingSpinner } from '../../styledComponents';
import TransactionWindow from '../TransactionWindow';
import { convertDateToString, getLastDateOfLastMonth, toDate } from '../../utils/dateHelpers';
import { createTransaction } from '../../utils/networkRequests';

const SectionContent = styled.div`
  width: 100%;
  margin-bottom: 40px;

  @media (max-width: ${breakpoints.mobile}) {
    margin-bottom: 50px;
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
`;

const NoWrap = styled.span`
  white-space: nowrap;
`;

const SplitTransactionsButton = styled(Button)`
  @media (max-width: ${breakpoints.mobile}) {
    margin: 10px 0 0 0;
  }
`;

const CostPercentField = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 20px;
`;

const CostPercentLabel = styled.label``;

const CostPercentSlider = styled.input`
  cursor: pointer;
`;

const CostPercentInput = styled.input`
  width: 50px;
  border: 1px solid ${colors.lightNeutralAccent};
  border-radius: 5px;
  padding: 10px 5px;
  font-size: inherit;
`;

const Spacer = styled.div`
  height: 20px;
`;

interface Props {
  accounts: Account[];
  transactions: Transaction[];
  selectedIds: Set<string | number>;
  resetForm: () => void;
  handleError: (e: unknown) => void;
  setActiveModal: (modalName: ModalName | null) => void;
}

export default function IouTransactionParams({
  accounts,
  transactions,
  selectedIds,
  resetForm,
  handleError,
  setActiveModal,
}: Props) {
  const [myShare, setMyShare] = useState(50);
  const [dateToSplitCosts, setDateToSplitCosts] = useState(getLastDateOfLastMonth());
  const [iouAccountTransactions, setIouAccountTransactions] = useState<Transaction[]>([]);
  const [isIouTransactionLoading, setIsIouTransactionLoading] = useState(false);
  const [iouAccountId, setIouAccountId] = useState('');
  const [succeeded, setSucceeded] = useState(false);

  const selectedTransactions = transactions.filter(({ id }) => selectedIds.has(id));

  const createSplitEntry = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    const categorizedTransactions = _.groupBy(selectedTransactions, 'category_id');

    const categorizedAmounts = _.reduce(
      categorizedTransactions,
      (accum, transactions, categoryId) => {
        accum[categoryId] = _.sumBy(transactions, 'amount');
        return accum;
      },
      {} as Record<string, number>,
    );

    const owedCategorizedAmounts = _.reduce(
      categorizedAmounts,
      (accum, amount, categoryId) => {
        accum[categoryId] = Math.round(amount * getOwedPercentage(myShare));
        return accum;
      },
      {} as Record<string, number>,
    );

    const summaryTransaction: TransactionPayload = {
      account_id: iouAccountId,
      date: convertDateToString(dateToSplitCosts),
      amount: _.reduce(owedCategorizedAmounts, (sum, amt) => sum - amt, 0),
      payee_id: null,
      payee_name: null,
      category_id: null,
      memo: null,
      cleared: 'uncleared',
      approved: true,
      flag_color: null,
      import_id: null,
      subtransactions: _.map(owedCategorizedAmounts, (amount, category_id) => ({
        amount: -amount,
        payee_id: null,
        payee_name: 'Shared Costs',
        category_id,
        memo: null,
      })),
    };

    try {
      setIsIouTransactionLoading(true);
      const transaction = await createTransaction(summaryTransaction);
      if (transaction) {
        setSucceeded(true);
        setIouAccountTransactions([...iouAccountTransactions, transaction]);
        resetForm();
      } else {
        handleError(null);
      }
    } catch (error) {
      handleError(error);
    }
    setIsIouTransactionLoading(false);
  };

  const isSplitTransactionDisabled = !selectedTransactions.length || !iouAccountId;

  const buttonDisabledMessage = !selectedTransactions.length
    ? (!iouAccountId && 'Please select shared costs and an IOU account') ||
      'Please select shared costs'
    : 'Please select an IOU account';

  const learnMoreLink = (
    <Hyperlink
      as="button"
      type="button"
      style={{ color: 'white', margin: 0 }}
      onClick={() => setActiveModal(ModalName.INSTRUCTIONS)}
    >
      Learn more
    </Hyperlink>
  );

  return (
    <SectionTile style={{ alignItems: 'start' }}>
      <form style={{ display: 'contents' }}>
        <SectionHeader style={{ width: '100%' }}>Split the Costs</SectionHeader>

        <SectionContent>
          <BudgetAutocomplete
            limit={1}
            onSelectionChange={([selectedAccount]) => setIouAccountId(selectedAccount?.id || '')}
            placeholder="Add one"
            items={accounts.map((acct) => ({
              id: acct.id,
              displayedContent: acct.name,
              searchableText: acct.name,
              data: acct,
            }))}
            label={'Select the "IOU" account that tracks what you are owed.'}
            labelDecoration={
              <InfoIcon
                tooltipContent={
                  <>
                    This account tracks what you are owed from the person sharing an account with
                    you. To create it in YNAB, click "Add Account", then "Add an Unlinked Account",
                    and nickname it something like "Owed from [person's name]." The account type
                    should be Checking, Savings, or Cash.
                  </>
                }
              />
            }
          />
        </SectionContent>

        <CostPercentField>
          <CostPercentLabel htmlFor="split-percentage-slider">
            Enter your share of the{' '}
            <NoWrap>
              costs.{' '}
              <InfoIcon
                tooltipContent={
                  <>
                    The percentage owed to you will be subtracted from your expenses and added to
                    your &quot;IOU&quot; account, via a single YNAB transaction. {learnMoreLink}
                  </>
                }
              />
            </NoWrap>
          </CostPercentLabel>

          <Row>
            <CostPercentSlider
              type="range"
              id="split-percentage-slider"
              min="0"
              max="100"
              value={myShare}
              onChange={(e) => setMyShare(Number(e.target.value))}
            />

            <NoWrap>
              <CostPercentInput
                type="number"
                id="split-percentage-input"
                min="0"
                max="100"
                value={myShare}
                onChange={(e) => {
                  const value = Math.max(0, Math.min(100, Number(e.target.value)));
                  setMyShare(value);
                }}
              />
              <span>%</span>
            </NoWrap>
          </Row>
        </CostPercentField>

        <Spacer />

        <DateSelector
          label="Select a transaction date."
          id="cost-split-date-selector"
          value={convertDateToString(dateToSplitCosts)}
          onChange={(value) => setDateToSplitCosts(toDate(value))}
          style={{
            flexDirection: 'column',
            gap: '10px',
            alignItems: 'unset',
            width: 'fit-content',
          }}
        />

        <Spacer />

        <Row style={{ width: '100%' }}>
          <SplitTransactionsButton
            type="submit"
            onClick={createSplitEntry}
            disabled={isSplitTransactionDisabled}
          >
            {isIouTransactionLoading ? <SubmittingSpinner /> : 'Split Costs'}
            &nbsp;
            {isSplitTransactionDisabled && (
              <InfoIcon color="white" tooltipContent={buttonDisabledMessage} />
            )}
          </SplitTransactionsButton>
        </Row>
      </form>

      <Spacer />

      {!!iouAccountTransactions.length && (
        <TransactionWindow
          loading={isIouTransactionLoading}
          title="Your IOU Transactions:"
          transactions={iouAccountTransactions}
        />
      )}

      {succeeded && (
        <Popup
          message="Transaction created"
          onClose={() => setSucceeded(false)}
          containerStyle={{ backgroundColor: colors.success }}
          closeButtonStyle={{ color: colors.success }}
        />
      )}
    </SectionTile>
  );
}

function getOwedPercentage(percentage: number) {
  const owedPercentage = 1 - percentage / 100;
  return owedPercentage;
}
