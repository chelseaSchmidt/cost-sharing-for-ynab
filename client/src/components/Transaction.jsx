/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
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
  selectTransaction,
  transaction,
  isIsolated,
  isSplitAcct,
  isSelectAllChecked = false,
}) => {
  const editable = type === 'Transactions in Shared Categories';
  const currencyOpts = { format: '%s%v', symbol: '$' };
  const {
    date,
    amount,
    // memo,
    // cleared,
    payee_name,
    category_name,
    account_name,
  } = transaction;

  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    setIsSelected(isSelectAllChecked);
  }, [isSelectAllChecked]);

  return (
    <div className="transaction">
      {isIsolated && !isSplitAcct && <span className="warning-symbol" />}
      {!isIsolated && !isSplitAcct && <span className="validated-symbol" />}
      {editable && (
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => {
            setIsSelected(e.target.checked);
            selectTransaction(e, transaction);
          }}
        />
      )}
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
          <button type="button" className="more-btn">
            More
            {/* TODO */}
          </button>
        </div>
      </div>
    </div>
  );
};

Transaction.propTypes = {
  type: string.isRequired,
  selectTransaction: func,
  isIsolated: bool.isRequired,
  isSplitAcct: bool.isRequired,
  isSelectAllChecked: bool,
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
