/* eslint-disable camelcase */
import React from 'react';
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
}) => {
  const editable = type.slice(0, 22) === 'Transactions in Shared';
  const {
    date,
    amount,
    memo,
    cleared,
    approved,
    payee_name,
    category_name,
  } = transaction;
  return (
    <div>
      {editable && <input type="checkbox" onChange={(e) => handleSelectTransaction(e, transaction)} />}
      <span>
        {`${date} | $${amount / 1000} | ${memo} | ${cleared} | ${approved} | ${payee_name} | ${category_name}`}
      </span>
    </div>
  );
};

Transaction.propTypes = {
  type: string.isRequired,
  handleSelectTransaction: func.isRequired,
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
