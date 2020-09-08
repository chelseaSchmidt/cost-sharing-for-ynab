/* eslint-disable camelcase */
import React from 'react';
import {
  shape,
  string,
  number,
  bool,
} from 'prop-types';

const Transaction = ({
  transaction: {
    date,
    amount,
    memo,
    cleared,
    approved,
    payee_name,
    category_name,
  },
}) => {
  return (
    <div>
      <input type="checkbox" />
      <span>
        {`${date} | $${amount / 1000} | ${memo} | ${cleared} | ${approved} | ${payee_name} | ${category_name}`}
      </span>
    </div>
  );
};

Transaction.propTypes = {
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
