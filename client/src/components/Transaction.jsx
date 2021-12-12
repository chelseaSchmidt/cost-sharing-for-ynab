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
  isEditable,
  selectTransaction,
  transaction,
  isIsolated,
  shouldShowIcon,
  isSelectAllChecked = false,
}) => {
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
      {isEditable && (
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
          {
            isIsolated && shouldShowIcon && (
              <span className="warning-symbol" style={{ backgroundColor: 'pink' }}>
                !
                <span className="warning-symbol-text">You did not mark this account as shared</span>
              </span>
            )
          }
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
  isEditable: bool,
  selectTransaction: func,
  isIsolated: bool.isRequired,
  shouldShowIcon: bool,
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
