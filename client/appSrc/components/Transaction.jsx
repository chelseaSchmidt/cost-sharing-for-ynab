/* eslint-disable camelcase */
import React, { useState } from 'react';
import moment from 'moment';
import formatCurrency from 'format-currency';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ElevatedTooltip from './ElevatedTooltip';
import { WarningIcon } from './styledComponents';

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

  ${(props) => props.isClickable && `
    cursor: pointer;
    :hover {
      background-color: #eee;
    }
    :active {
      background-color: #ddd;
    }
  `}
`;

const Checkbox = styled.input`
  cursor: pointer;
`;

const Date = styled.div`
  flex: 2;
  color: gray;
  font-size: 12px;
`;

const Amount = styled.div`
  flex: 2;
  font-size: 17px;
  padding: 0 5px;
`;

const Details = styled.div`
  flex: 3;
  font-size: 12px;
  overflow: auto;
  white-space: nowrap;
`;

const AccountName = styled.div`
  display: flex;
`;

const TransactionWarningIcon = styled(WarningIcon)`
  background-color: rgba(255, 0, 0, 0.1);
`;

/* Main Component */

const Transaction = ({
  isClickable,
  isSelected,
  toggleTransactionSelection,
  transaction,
  isIsolated,
  shouldShowIcon,
}) => {
  const {
    date,
    amount,
    payee_name,
    category_name,
    account_name,
  } = transaction;

  const [tooltipCoordinates, setTooltipCoordinates] = useState(null);

  const onClick = () => {
    toggleTransactionSelection({
      isSelected: !isSelected,
      transaction,
    });
  };

  const getElementCoordinates = (element) => ([
    element.getBoundingClientRect().x,
    element.getBoundingClientRect().y,
  ]);

  const tooltipStyle = {
    zIndex: 10,
    position: 'fixed',
    left: tooltipCoordinates?.[0],
    top: tooltipCoordinates?.[1],
    transform: 'translate(calc(-100% + 15px), -105%)',
    width: '170px',
    backgroundColor: '#444',
    color: 'white',
    fontSize: '11px',
    fontWeight: 'normal',
    textAlign: 'center',
    padding: '5px',
    borderRadius: '5px',
  };

  return (
    <Container
      onClick={isClickable ? onClick : () => {}}
      isClickable={isClickable}
    >
      {isClickable && (
        <Checkbox
          type="checkbox"
          checked={isSelected}
          readOnly
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
              <TransactionWarningIcon
                onMouseEnter={(e) => setTooltipCoordinates(getElementCoordinates(e.target))}
                onMouseLeave={() => setTooltipCoordinates(null)}
                onClick={(e) => e.stopPropagation()}
              >
                !
                {
                  tooltipCoordinates && (
                    <ElevatedTooltip containerStyle={tooltipStyle}>
                      You did not mark this account as shared
                    </ElevatedTooltip>
                  )
                }
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
  isClickable: PropTypes.bool,
  toggleTransactionSelection: PropTypes.func,
  isIsolated: PropTypes.bool.isRequired,
  shouldShowIcon: PropTypes.bool,
  isSelected: PropTypes.bool.isRequired,
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
