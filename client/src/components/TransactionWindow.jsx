import React from 'react';
import {
  arrayOf,
  shape,
  string,
  func,
} from 'prop-types';
import Transaction from './Transaction';
import '../styles/TransactionWindow.css';

const TransactionWindow = ({
  title,
  transactions,
  isolatedTransactions,
  handleSelectTransaction,
}) => {
  const noTransactions = transactions.length === 0;
  const isolatedTransactionIds = isolatedTransactions.map((txn) => txn.id);
  return (
    <div className="transaction-window">
      <h2>{title}</h2>
      {!noTransactions && transactions.map((txn) => {
        let isIsolated = false;
        if (isolatedTransactionIds.indexOf(txn.id) > -1) {
          isIsolated = true;
        }
        return (
          <Transaction
            transaction={txn}
            type={title}
            handleSelectTransaction={handleSelectTransaction}
            isIsolated={isIsolated}
            key={txn.id}
          />
      )})}
      {noTransactions && <span><em>No transactions</em></span>}
    </div>
  );
};

TransactionWindow.propTypes = {
  transactions: arrayOf(shape({ id: string })).isRequired,
  isolatedTransactions: arrayOf(shape({ id: string })).isRequired,
  title: string.isRequired,
  handleSelectTransaction: func.isRequired,
};

export default TransactionWindow;
