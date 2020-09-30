/* eslint-disable camelcase */
import React from 'react';
import moment from 'moment';
import formatCurrency from 'format-currency';
import {
  shape,
  string,
  number,
  bool,
  func,
} from 'prop-types';

const Transaction = ({
  type,
  handleSelectTransaction,
  transaction,
  isIsolated,
  txnNumber,
  checked = 0,
}) => {
  const editable = type === 'Transactions in Shared Categories';
  const currencyOpts = { format: '%s%v', symbol: '$' };
  const {
    date,
    amount,
    memo,
    cleared,
    payee_name,
    category_name,
    account_name,
  } = transaction;
  return (
    <div className="transaction">
      {isIsolated && <span className="warning-symbol" />}
      {!isIsolated && <span className="validated-symbol" />}
      {editable && <input type="checkbox" checked={!!checked} onChange={(e) => handleSelectTransaction(e, transaction, txnNumber)} />}
      <div className="txn-date">
        {moment(date).format('MMM DD, YYYY')}
      </div>
      <div className="txn-amt">
        {formatCurrency(amount / -1000, currencyOpts)}
      </div>
      <div className="txn-details">
        <div className="txn-cat">
          {category_name}
        </div>
        <div className="txn-payee">
          {payee_name}
        </div>
        <div className="txn-acct">
          {account_name}
        </div>
        <div className="txn-more">
          <a href="#">More</a>
        </div>
      </div>
    </div>
  );
};

Transaction.propTypes = {
  type: string.isRequired,
  handleSelectTransaction: func.isRequired,
  isIsolated: bool.isRequired,
  txnNumber: number.isRequired,
  checked: number,
  transaction: shape({
    date: string,
    amount: number,
    memo: string,
    cleared: string,
    approved: bool,
    payee_name: string,
    category_name: string,
  }).isRequired,
};

export default Transaction;
