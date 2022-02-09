import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Transaction from './Transaction';
import { Spinner, BaseButton } from './styledComponents';
import { toId } from './utils/general';
import breakpoints from '../../shared/breakpoints';

/* Styled Components */

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  margin: 0 10px;
  padding: 15px;

  @media (max-width: ${breakpoints.tiny}) {
    padding: 5px
  }
`;

const Title = styled.h3``;

const RefreshButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const RefreshButton = styled(BaseButton)`
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

  ::-webkit-scrollbar {
    width: 7px;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0, 0, 0, .5);
    box-shadow: 0 0 1px rgba(255, 255, 255, .5);
  }
  ::-webkit-scrollbar-track {
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
  shouldShowIcon,
  isClickable,
  shouldShowRefreshButton = false,
  refreshTransactions = () => {},
  shouldShowLoadingOverlay = false,
  containerStyle = {},
  feedStyle = {},
}) => {
  const isolatedTransactionIds = transactionsSharedInOneButNotOther.map(toId);
  const selectedTransactionIds = selectedTransactions.map(toId);

  return (
    <Container style={containerStyle}>
      {title && <Title>{title}</Title>}

      {description}

      {
        shouldShowRefreshButton && (
          <RefreshButtonContainer>
            <RefreshButton
              type="button"
              onClick={refreshTransactions}
            >
              Refresh
            </RefreshButton>
          </RefreshButtonContainer>
        )
      }

      {
        !loading && (
          <>
            <SelectAllCheckboxContainer>
              {
                !!transactions.length
                && isClickable
                && (
                  <SelectAllCheckboxLabel htmlFor="select-all-input">
                    <SelectAllCheckbox
                      type="checkbox"
                      checked={isSelectAllChecked}
                      onChange={(e) => toggleSelectAll({ isSelected: e.target.checked })}
                      id="select-all-input"
                    />
                    Select All
                  </SelectAllCheckboxLabel>
                )
              }
            </SelectAllCheckboxContainer>

            {
              !!transactions.length && (
                <TransactionFeed style={feedStyle}>
                  {
                    transactions.map((transaction) => (
                      <Transaction
                        key={transaction.id}
                        isClickable={isClickable}
                        // FIXME: nested loop
                        isSelected={!!selectedTransactionIds.includes(transaction.id)}
                        toggleTransactionSelection={toggleTransactionSelection}
                        transaction={transaction}
                        // FIXME: nested loop
                        isIsolated={!!isolatedTransactionIds.includes(transaction.id)}
                        shouldShowIcon={shouldShowIcon}
                        isSelectAllChecked={isSelectAllChecked}
                      />
                    ))
                  }
                </TransactionFeed>
              )
            }
          </>
        )
      }

      {
        loading && (
          shouldShowLoadingOverlay
            ? (
              <TransactionFeedLoadingOverlay style={feedStyle}>
                <TransactionLoadingSpinner />
              </TransactionFeedLoadingOverlay>
            )
            : (
              <TransactionLoadingSpinner />
            )
        )
      }

      {!transactions.length && !loading && <em>No transactions</em>}

    </Container>
  );
};

TransactionWindow.propTypes = {
  loading: PropTypes.bool,
  transactions: PropTypes.array.isRequired,
  selectedTransactions: PropTypes.array,
  transactionsSharedInOneButNotOther: PropTypes.array,
  title: PropTypes.string,
  description: PropTypes.string,
  toggleTransactionSelection: PropTypes.func,
  toggleSelectAll: PropTypes.func,
  isSelectAllChecked: PropTypes.bool,
  shouldShowIcon: PropTypes.bool,
  isClickable: PropTypes.bool,
  containerStyle: PropTypes.object,
  feedStyle: PropTypes.object,
  shouldShowRefreshButton: PropTypes.bool,
  refreshTransactions: PropTypes.func,
  shouldShowLoadingOverlay: PropTypes.bool,
};

export default TransactionWindow;
