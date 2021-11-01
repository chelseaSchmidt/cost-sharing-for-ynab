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
}) => {
  const noTransactions = transactions.length === 0;
  const isEditable = title === 'Transactions in Shared Categories';
  const isSplitAcct = title === 'Account Receiving Split Transaction';
  const isolatedTransactionIds = transactionsSharedInOneButNotOther.map((txn) => txn.id);
  return (
    <div className="transaction-window">
      <h3 className="window-title">{title}</h3>
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
              type={title}
              selectTransaction={selectTransaction}
              transaction={txn}
              isIsolated={isIsolated}
              isSplitAcct={isSplitAcct}
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
  title: string.isRequired,
  selectTransaction: func,
  selectAllTransactions: func,
  isSelectAllChecked: bool,
};

export default TransactionWindow;
