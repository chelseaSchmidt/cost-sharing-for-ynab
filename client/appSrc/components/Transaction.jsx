/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import formatCurrency from 'format-currency';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { WarningIcon, Tooltip } from './styledComponents';

/* Styled Components */

const Container = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid lightgray;
  border-radius: 12px;
  box-shadow: 0 1px 0 0.5px #f1f2f1;
  margin: 0 2px 5px 0;
  padding: 5px;
  background-color: white;
  color: #464b46;
`;

const Checkbox = styled.input`
  cursor: pointer;
`;

const Date = styled.div`
  color: gray;
  margin-right: 20px;
  font-size: 12px;
`;

const Amount = styled.div`
  width: 100px;
  text-align: center;
  margin-right: 5px;
  font-size: 17px;
`;

const Details = styled.div`
  font-size: 12px;
`;

const AccountName = styled.div`
  display: flex;
`;

const TransactionWarningIcon = styled(WarningIcon)`
  background-color: rgba(255, 0, 0, 0.1);
`;

/* Main Component */

const Transaction = ({
  isEditable,
  selectTransaction,
  transaction,
  isIsolated,
  shouldShowIcon,
  isSelectAllChecked = false,
}) => {
  const {
    date,
    amount,
    payee_name,
    category_name,
    account_name,
    // memo,
    // cleared,
  } = transaction;

  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    setIsSelected(isSelectAllChecked);
  }, [isSelectAllChecked]);

  return (
    <Container>
      {isEditable && (
        <Checkbox
          type="checkbox"
          checked={isSelected}
          onChange={(e) => {
            setIsSelected(e.target.checked);
            selectTransaction(e, transaction);
          }}
        />
      )}

      <Date>
        {moment(date).format('MMM DD, YYYY')}
      </Date>

      <Amount>
        {formatCurrency(
          amount / -1000,
          { format: '%s%v', symbol: '$' },
        )}
      </Amount>

      <Details>
        <div>
          {category_name}
        </div>

        <div>
          {payee_name}
        </div>

        <AccountName>
          {account_name}

          {
            isIsolated && shouldShowIcon && (
              <TransactionWarningIcon>
                !
                <Tooltip>
                  You did not mark this account as shared
                </Tooltip>
              </TransactionWarningIcon>
            )
          }
        </AccountName>

        {/* TODO: "More" button */}
      </Details>
    </Container>
  );
};

Transaction.propTypes = {
  isEditable: PropTypes.bool,
  selectTransaction: PropTypes.func,
  isIsolated: PropTypes.bool.isRequired,
  shouldShowIcon: PropTypes.bool,
  isSelectAllChecked: PropTypes.bool,
  transaction: PropTypes.shape({
    date: PropTypes.string,
    amount: PropTypes.number,
    memo: PropTypes.string,
    cleared: PropTypes.string,
    approved: PropTypes.bool,
    payee_name: PropTypes.string,
    category_name: PropTypes.string,
    account_name: PropTypes.string,
  }).isRequired,
};

export default Transaction;
