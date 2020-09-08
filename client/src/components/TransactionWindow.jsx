import React from 'react';
import { arrayOf, shape, string } from 'prop-types';
import Transaction from './Transaction';

const TransactionWindow = ({ transactions }) => {
  return (
    <div>
      {transactions.map((txn) => <Transaction transaction={txn} key={txn.id} />)}
    </div>
  );
};

TransactionWindow.propTypes = {
  transactions: arrayOf(shape({ id: string })).isRequired,
};

export default TransactionWindow;
