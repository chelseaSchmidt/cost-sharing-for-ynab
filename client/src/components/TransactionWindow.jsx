import React from 'react';
import {
  arrayOf,
  shape,
  string,
  func,
  bool,
} from 'prop-types';
import Transaction from './Transaction';
import '../styles/TransactionWindow.css';

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
    <div className="transaction-window">
      {title && <h3 className="window-title">{title}</h3>}
      <div className="select-all-area">
        {!noTransactions
        && isEditable
        && (
          <label htmlFor="select-all-input">
            <input
              type="checkbox"
              checked={isSelectAllChecked}
              onChange={selectAllTransactions}
              id="select-all-input"
            />
            Select All
          </label>
        )}
      </div>
      <div className="transaction-feed">
        {!noTransactions && transactions.map((txn) => {
          let isIsolated = false;
          if (isolatedTransactionIds.indexOf(txn.id) > -1) {
            isIsolated = true;
          }
          return (
            <Transaction
              key={txn.id}
              isEditable={isEditable}
              selectTransaction={selectTransaction}
              transaction={txn}
              isIsolated={isIsolated}
              shouldShowIcon={shouldShowIcon}
              isSelectAllChecked={isSelectAllChecked}
            />
          );
        })}
      </div>
      {noTransactions && <span><em>No transactions</em></span>}
    </div>
  );
};

TransactionWindow.propTypes = {
  transactions: arrayOf(shape({ id: string })).isRequired,
  transactionsSharedInOneButNotOther: arrayOf(shape({ id: string })),
  title: string,
  selectTransaction: func,
  selectAllTransactions: func,
  isSelectAllChecked: bool,
  shouldShowIcon: bool,
  isEditable: bool,
};

export default TransactionWindow;
