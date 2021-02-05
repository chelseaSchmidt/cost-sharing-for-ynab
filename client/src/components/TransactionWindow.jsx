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
import { toId } from '../../utilities/general';

const TransactionWindow = ({
  title,
  transactions,
  isolatedTransactions,
  handleSelectTransaction,
  selectAll = () => {},
  checkmarks = [],
}) => {
  const noTransactions = transactions.length === 0;
  const isEditable = title === 'Transactions in Shared Categories';
  const isSplitAcct = title === 'Account Receiving Split Transaction';
  const isolatedTransactionIds = isolatedTransactions.map(toId);
  return (
    <div className="transaction-window">
      <h3 className="window-title">{title}</h3>
      <div className="select-all-area">
        {!noTransactions
        && isEditable
        && (
          <label htmlFor="select-all-input">
            <input type="checkbox" onChange={selectAll} id="select-all-input" />
            Select All
          </label>
        )}
      </div>
      <div className="transaction-feed">
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
              isSplitAcct={isSplitAcct}
              key={txn.id}
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
  isolatedTransactions: arrayOf(shape({ id: string })).isRequired,
  checkmarks: arrayOf(number),
  title: string.isRequired,
  handleSelectTransaction: func.isRequired,
  selectAll: func,
};

export default TransactionWindow;
