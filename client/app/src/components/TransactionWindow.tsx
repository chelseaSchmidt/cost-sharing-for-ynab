import styled from 'styled-components';
import TransactionCard from './TransactionCard';
import { FlexColumnAllCentered, ScrollableArea, Spinner } from './styledComponents';
import { toId } from './utils/general';
import breakpoints from '../../../shared/breakpoints';
import { Button } from '../../../shared/styledComponents';
import { Transaction } from '../types';
import { CSSProperties } from 'react';
import Checkbox from './Checkbox';

const FEED_PADDING_Y_LG = '30px';
const FEED_PADDING_Y_SM = '10px';

/* Styled Components */

const Container = styled(FlexColumnAllCentered)`
  box-sizing: border-box;
  flex: 1;
  width: 100%;
  overflow: hidden;
  gap: 15px;
`;

const Title = styled.h3``;

const RefreshButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const RefreshButton = styled(Button)`
  margin-top: 20px;
  width: fit-content;
`;

const SelectAllCheckboxContainer = styled.div`
  height: 15px;
  margin-bottom: 15px;
`;

const TransactionArea = styled(FlexColumnAllCentered)`
  position: relative;
  flex: 1;
  width: 100%;
  overflow: hidden;
  gap: 15px;
`;

const TransactionFeed = styled(ScrollableArea)`
  box-sizing: border-box;
  width: 100%;
  padding: ${FEED_PADDING_Y_LG} 30px;

  @media (max-width: ${breakpoints.mobile}) {
    padding: ${FEED_PADDING_Y_SM} 5px;
  }

  @media (max-width: ${breakpoints.tiny}) {
    padding: ${FEED_PADDING_Y_SM} 5px;
  }
`;

const TransactionFeedLoadingOverlay = styled(TransactionFeed)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TransactionLoadingSpinner = styled(Spinner)`
  height: 20px;
  width: 20px;
`;

/* Main Component */

interface Props {
  loading?: boolean;
  title?: string;
  description?: string;
  transactions: Transaction[];
  selectedTransactions?: Transaction[];
  transactionsSharedInOneButNotOther?: Transaction[];
  toggleTransactionSelection?: (options: { isSelected: boolean; transaction: Transaction }) => void;
  toggleSelectAll?: (options: { isSelected: boolean }) => void;
  isSelectAllChecked?: boolean;
  shouldShowIcon?: boolean;
  isClickable?: boolean;
  shouldShowRefreshButton?: boolean;
  refreshTransactions?: () => void;
  shouldShowLoadingOverlay?: boolean;
  containerStyle?: CSSProperties;
  feedStyle?: CSSProperties;
}

const TransactionWindow = ({
  loading = false,
  title,
  description = '',
  transactions,
  selectedTransactions = [],
  transactionsSharedInOneButNotOther = [],
  toggleTransactionSelection,
  toggleSelectAll,
  isSelectAllChecked,
  shouldShowIcon = false,
  isClickable = false,
  shouldShowRefreshButton = false,
  refreshTransactions = () => {},
  shouldShowLoadingOverlay = false,
  containerStyle = {},
  feedStyle = {},
}: Props) => {
  const isolatedTransactionIds = transactionsSharedInOneButNotOther.map(toId);
  const selectedTransactionIds = selectedTransactions.map(toId);

  return (
    <Container style={containerStyle}>
      {title && <Title>{title}</Title>}

      {description}

      {shouldShowRefreshButton && (
        <RefreshButtonContainer>
          <RefreshButton type="button" onClick={refreshTransactions}>
            Refresh
          </RefreshButton>
        </RefreshButtonContainer>
      )}

      {!loading && (
        <TransactionArea>
          <SelectAllCheckboxContainer>
            {!!transactions.length && isClickable && toggleSelectAll && (
              <Checkbox
                id="select-all-checkbox"
                label="Select all"
                checked={!!isSelectAllChecked}
                onChange={(isSelected) => toggleSelectAll({ isSelected })}
              />
            )}
          </SelectAllCheckboxContainer>

          {!!transactions.length && (
            <TransactionFeed style={feedStyle}>
              {transactions.map((transaction) => (
                <TransactionCard
                  key={transaction.id}
                  isClickable={isClickable}
                  isSelected={!!selectedTransactionIds.includes(transaction.id)}
                  toggleTransactionSelection={toggleTransactionSelection}
                  transaction={transaction}
                  isIsolated={!!isolatedTransactionIds.includes(transaction.id)}
                  shouldShowIcon={shouldShowIcon}
                />
              ))}
            </TransactionFeed>
          )}
        </TransactionArea>
      )}

      {loading &&
        (shouldShowLoadingOverlay ? (
          <TransactionFeedLoadingOverlay style={feedStyle}>
            <TransactionLoadingSpinner />
          </TransactionFeedLoadingOverlay>
        ) : (
          <TransactionLoadingSpinner />
        ))}

      {!transactions.length && !loading && <em>No transactions</em>}
    </Container>
  );
};

export default TransactionWindow;
