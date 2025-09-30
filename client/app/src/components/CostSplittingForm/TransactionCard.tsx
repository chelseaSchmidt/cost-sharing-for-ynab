import moment from 'moment';
import styled from 'styled-components';
import breakpoints from '../../../../shared/breakpoints';
import colors from '../../../../shared/colors';
import { Transaction } from '../../types';
import Checkbox from '../Checkbox';
import InfoIcon from '../InfoIcon';
import { FlexRow } from '../styledComponents';

/* Styled Components */

const ContainerButton = styled.button<{ $isSelected?: boolean }>`
  all: unset;
  display: flex;
  align-items: center;
  border: 1px solid ${colors.lightNeutralAccent};
  border-radius: 3px;
  box-shadow: 0 1px 2px 0 ${colors.lightNeutralBg};
  margin: 0 2px 7px 0;
  padding: 5px;
  background-color: white;

  ${({ $isSelected }) => ($isSelected ? `background: ${colors.primaryLight};` : '')}

  &:last-child {
    margin-bottom: 0;
  }

  &:not([disabled]) {
    cursor: pointer;

    &:hover {
      background-color: ${colors.lightNeutralBg};
    }

    &:active {
      background-color: ${colors.lightNeutralActive};
    }
  }

  &:focus-visible {
    outline: 1px solid ${colors.buttonFocusOutline};
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 12px;
  }
`;

const Date = styled.div`
  flex: 2;
  margin-left: 5px;
  color: ${colors.lightFont};
`;

const Amount = styled.div`
  flex: 2;
  font-size: 1.4em;
  padding: 0 5px;
`;

const Details = styled.div`
  flex: 3;
  overflow: auto;
  white-space: nowrap;

  @media (max-width: ${breakpoints.mobile}) {
    /* spacing from maybe-scrollbar */
    padding: 5px 0;
  }
`;

const AccountName = styled(FlexRow)`
  gap: 3px;
`;

/* Main Component */

interface Props {
  isClickable: boolean;
  isSelected: boolean;
  toggleTransactionSelection?: (options: { isSelected: boolean; transaction: Transaction }) => void;
  transaction: Transaction;
  isIsolated: boolean;
  shouldShowIcon: boolean;
}

const TransactionCard = ({
  isClickable,
  isSelected,
  toggleTransactionSelection,
  transaction,
  isIsolated,
  shouldShowIcon,
}: Props) => {
  const {
    date,
    amount,
    payee_name: payeeName,
    category_name: categoryName,
    account_name: accountName,
  } = transaction;

  const onClick = () => {
    toggleTransactionSelection?.({
      isSelected: !isSelected,
      transaction,
    });
  };

  return (
    <ContainerButton
      type="button"
      disabled={!isClickable}
      onClick={onClick}
      $isSelected={isSelected}
    >
      {isClickable && (
        <Checkbox
          id={`${transaction.id}-checkbox`}
          label={`${transaction.id}`}
          isLabelHidden
          checked={isSelected}
        />
      )}

      <Date>{moment(date).format('MMM DD, YYYY')}</Date>

      <Amount>{toUsd(amount)}</Amount>

      <Details>
        {[categoryName, payeeName].map((detail) => (
          <FlexRow key={detail}>{detail}</FlexRow>
        ))}

        <AccountName>
          {accountName}

          {isIsolated && shouldShowIcon && (
            <InfoIcon
              theme="error"
              tooltipContent="You did not mark this account as shared"
              portaled
            />
          )}
        </AccountName>
      </Details>
    </ContainerButton>
  );
};

export default TransactionCard;

function toUsd(amount: number) {
  return Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount / -1000);
}
