import styled from 'styled-components';
import TransactionCard from './TransactionCard';
import { Spinner } from './styledComponents';
import { toId } from './utils/general';
import breakpoints from '../../../shared/breakpoints';
import { Button } from '../../../shared/styledComponents';
import { Transaction } from '../types';
import { CSSProperties } from 'react';

/* Styled Components */

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 15px 25px;

  @media (max-width: ${breakpoints.tiny}) {
    padding: 5px;
  }
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

const SelectAllCheckboxLabel = styled.label``;

const SelectAllCheckbox = styled.input`
  cursor: pointer;
`;

const TransactionFeed = styled.div`
  box-sizing: border-box;
  max-height: 60vh;
  width: 100%;
  overflow: auto;
  border-top: 1px solid lightgray;
  border-bottom: 1px solid lightgray;
  padding: 30px;

  @media (max-width: ${breakpoints.mobile}) {
    padding: 10px;
  }

  @media (max-width: ${breakpoints.tiny}) {
    padding: 5px;
  }

  &::-webkit-scrollbar {
    width: 7px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.5);
    box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
  }
  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
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
        <>
          <SelectAllCheckboxContainer>
            {!!transactions.length && isClickable && toggleSelectAll && (
              <SelectAllCheckboxLabel htmlFor="select-all-input">
                <SelectAllCheckbox
                  type="checkbox"
                  checked={isSelectAllChecked}
                  onChange={(e) => toggleSelectAll({ isSelected: e.target.checked })}
                  id="select-all-input"
                />
                Select All
              </SelectAllCheckboxLabel>
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
        </>
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
