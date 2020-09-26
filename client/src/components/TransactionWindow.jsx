import React from 'react';
import {
  arrayOf,
  shape,
  string,
  func,
  number,
} from 'prop-types';
import Transaction from './Transaction';
import '../styles/TransactionWindow.css';

const TransactionWindow = ({
  title,
  transactions,
  isolatedTransactions,
  handleSelectTransaction,
  selectAll = () => {},
  checkmarks = [],
}) => {
  const noTransactions = transactions.length === 0;
  const isolatedTransactionIds = isolatedTransactions.map((txn) => txn.id);
  return (
    <div className="transaction-window">
      <h2>{title}</h2>
      {!noTransactions && (
        <div>
          <input type="checkbox" onChange={selectAll} />
          Select All
        </div>
      )}
      {!noTransactions && transactions.map((txn, i) => {
        let isIsolated = false;
        if (isolatedTransactionIds.indexOf(txn.id) > -1) {
          isIsolated = true;
        }
        return (
          <Transaction
            txnNumber={i}
            checked={checkmarks[i]}
            transaction={txn}
            type={title}
            handleSelectTransaction={handleSelectTransaction}
            isIsolated={isIsolated}
            key={txn.id}
          />
        );
      })}
      {noTransactions && <span><em>No transactions</em></span>}
    </div>
  );
};

TransactionWindow.propTypes = {
  transactions: arrayOf(shape({ id: string })).isRequired,
  isolatedTransactions: arrayOf(shape({ id: string })).isRequired,
  checkmarks: arrayOf(number),
  title: string.isRequired,
  handleSelectTransaction: func.isRequired,
  selectAll: func,
};

export default TransactionWindow;
