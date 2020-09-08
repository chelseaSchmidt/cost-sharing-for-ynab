import React from 'react';
import { arrayOf, shape, string } from 'prop-types';
import Transaction from './Transaction';
import '../styles/TransactionWindow.css';

const TransactionWindow = ({ title, transactions }) => {
  const noTransactions = transactions.length === 0;
  return (
    <div className="transaction-window">
      <h2>{title}</h2>
      {!noTransactions && transactions.map((txn) => <Transaction transaction={txn} key={txn.id} />)}
      {noTransactions && <span><em>No transactions</em></span>}
    </div>
  );
};

TransactionWindow.propTypes = {
  transactions: arrayOf(shape({ id: string })).isRequired,
  title: string.isRequired,
};

export default TransactionWindow;
