import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Transaction from './Transaction';
import { Spinner } from './styledComponents';

/* Styled Components */

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 10px;
  padding: 15px;
`;

const Title = styled.h3``;

const SelectAllCheckboxContainer = styled.div`
  height: 15px;
  margin-bottom: 15px;
`;

const SelectAllCheckboxLabel = styled.label``;

const SelectAllCheckbox = styled.input`
  cursor: pointer;
`;

const TransactionFeed = styled.div`
  max-height: 60vh;
  overflow-y: auto;
  border-top: 1px solid lightgray;
  border-bottom: 1px solid lightgray;
  padding: 30px;

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

/* Main Component */

const TransactionWindow = ({
  loading = false,
  title,
  transactions,
  checkedTransactions = [],
  transactionsSharedInOneButNotOther = [],
  toggleTransactionSelection,
  toggleSelectAll,
  isSelectAllChecked,
  shouldShowIcon,
  isEditable,
}) => {
  const isolatedTransactionIds = transactionsSharedInOneButNotOther.map(({ id }) => id);

  return (
    <Container>
      {title && <Title>{title}</Title>}

      {
        !loading && (
          <>
            <SelectAllCheckboxContainer>
              {
                !!transactions.length
                && isEditable
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
                <TransactionFeed>
                  {
                    transactions.map((transaction) => (
                      <Transaction
                        key={transaction.id}
                        isEditable={isEditable}
                        // FIXME: nested loop
                        isSelected={!!checkedTransactions.find(({ id }) => id === transaction.id)}
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
          <Spinner
            style={{
              height: '20px',
              width: '20px',
            }}
          />
        )
      }

      {!transactions.length && !loading && <em>No transactions</em>}

    </Container>
  );
};

TransactionWindow.propTypes = {
  loading: PropTypes.bool,
  transactions: PropTypes.array.isRequired,
  checkedTransactions: PropTypes.array,
  transactionsSharedInOneButNotOther: PropTypes.array,
  title: PropTypes.string,
  toggleTransactionSelection: PropTypes.func,
  toggleSelectAll: PropTypes.func,
  isSelectAllChecked: PropTypes.bool,
  shouldShowIcon: PropTypes.bool,
  isEditable: PropTypes.bool,
};

export default TransactionWindow;
