import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Transaction from './Transaction';

/* Styled Components */

const Container = styled.div`
  margin: 0 10px;
  padding: 15px;
  border-radius: 12px;
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

  ::-webkit-scrollbar {
    width: 7px;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0, 0, 0, .5);
    box-shadow: 0 0 1px rgba(255, 255, 255, .5);
  }
  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  }
`;

/* Main Component */

const TransactionWindow = ({
  title,
  transactions,
  transactionsSharedInOneButNotOther = [],
  selectTransaction,
  selectAllTransactions,
  isSelectAllChecked,
  shouldShowIcon,
  isEditable,
}) => {
  const noTransactions = transactions.length === 0;
  const isolatedTransactionIds = transactionsSharedInOneButNotOther.map((txn) => txn.id);

  return (
    <Container>
      {title && <Title>{title}</Title>}

      <SelectAllCheckboxContainer>
        {
          !noTransactions
          && isEditable
          && (
            <SelectAllCheckboxLabel htmlFor="select-all-input">
              <SelectAllCheckbox
                type="checkbox"
                checked={isSelectAllChecked}
                onChange={selectAllTransactions}
                id="select-all-input"
              />
              Select All
            </SelectAllCheckboxLabel>
          )
        }
      </SelectAllCheckboxContainer>

      <TransactionFeed>
        {
          !!transactions.length && transactions.map((transaction) => (
            <Transaction
              key={transaction.id}
              isEditable={isEditable}
              selectTransaction={selectTransaction}
              transaction={transaction}
              isIsolated={!!isolatedTransactionIds.includes(transaction.id)}
              shouldShowIcon={shouldShowIcon}
              isSelectAllChecked={isSelectAllChecked}
            />
          ))
        }
      </TransactionFeed>

      {noTransactions && <em>No transactions</em>}
    </Container>
  );
};

TransactionWindow.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.string }),
  ).isRequired,
  transactionsSharedInOneButNotOther: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.string }),
  ),
  title: PropTypes.string,
  selectTransaction: PropTypes.func,
  selectAllTransactions: PropTypes.func,
  isSelectAllChecked: PropTypes.bool,
  shouldShowIcon: PropTypes.bool,
  isEditable: PropTypes.bool,
};

export default TransactionWindow;
