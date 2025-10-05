import styled from 'styled-components';
import breakpoints from '../../../../../shared/breakpoints';
import Button from '../../../../../shared/Button';
import colors from '../../../../../shared/colors';
import { FlexRow } from '../../../../../shared/styledComponents';
import { Transaction } from '../../../types';
import Checkbox from '../../Checkbox';
import InfoIcon from '../../InfoIcon';
import { stringToReadableDate } from '../../utils/dateHelpers';
import { toUsd } from '../../utils/general';

/* Styled Components */

const ContainerButton = styled(Button)<{ $isSelected?: boolean }>`
  cursor: unset;
  text-align: unset;
  letter-spacing: unset;
  color: inherit;
  font-family: inherit;

  border: 1px solid ${colors.lightNeutralAccent};
  border-radius: 3px;
  box-shadow: 0 1px 2px 0 ${colors.lightNeutralBg};
  margin: 0 2px 7px 0;
  padding: 5px;
  background: white;

  ${({ $isSelected }) => ($isSelected ? `background: ${colors.primaryLight};` : '')}

  &:last-child {
    margin-bottom: 0;
  }

  &:not([disabled]) {
    cursor: pointer;

    &:hover {
      background: ${colors.lightNeutralBg};
    }

    &:active {
      background: ${colors.lightNeutralActive};
    }
  }

  &:disabled {
    cursor: unset;
    background: unset;
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
  transaction: Transaction;
  isFlagged: boolean;
  formControlProps?: {
    isSelected: boolean;
    toggleTransaction: (transaction: Transaction) => void;
  };
}

export default function TransactionCard({ transaction, isFlagged, formControlProps }: Props) {
  const {
    date,
    amount,
    payee_name: payeeName,
    category_name: categoryName,
    account_name: accountName,
  } = transaction;

  return (
    <ContainerButton
      disabled={!formControlProps}
      onClick={() => formControlProps?.toggleTransaction(transaction)}
      $isSelected={formControlProps?.isSelected}
    >
      {formControlProps && (
        <Checkbox
          id={`${transaction.id}-checkbox`}
          label={`${transaction.id}`}
          isLabelHidden
          checked={formControlProps.isSelected}
        />
      )}

      <Date>{stringToReadableDate(date)}</Date>

      <Amount>{toUsd(amount)}</Amount>

      <Details>
        {[categoryName, payeeName].map((detail) => (
          <FlexRow key={detail}>{detail}</FlexRow>
        ))}

        <AccountName>
          {accountName}

          {isFlagged && (
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
}
