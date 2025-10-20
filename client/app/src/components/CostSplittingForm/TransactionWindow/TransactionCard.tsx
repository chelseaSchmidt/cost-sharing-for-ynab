import styled from 'styled-components';
import breakpoints from '../../../../../shared/breakpoints';
import Button from '../../../../../shared/Button';
import colors from '../../../../../shared/colors';
import { FlexColumnAllCentered, FlexRow } from '../../../../../shared/styledComponents';
import { MixedTransaction } from '../../../types';
import Checkbox from '../../Checkbox';
import InfoIcon from '../../InfoIcon';
import { stringToReadableDate } from '../../utils/dateHelpers';
import { toUsd } from '../../utils/general';

/* Styled Components */

const BORDER_RADIUS = '3px';

const ContainerButton = styled(Button)<{ $isSelected?: boolean }>`
  cursor: unset;
  text-align: unset;
  letter-spacing: unset;
  color: inherit;
  font-family: inherit;

  position: relative;
  border: 1px solid ${colors.lightNeutralAccent};
  border-radius: ${BORDER_RADIUS};
  box-shadow: 0 1px 2px 0 ${colors.lightNeutralBg};
  margin: 0 2px 7px 0;
  background: white;

  /* leaves space for sub-transaction info accent */
  padding: 5px 5px 5px 14px;

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

const SubTransactionAccent = styled(FlexColumnAllCentered)`
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  border-right: 1px dashed ${colors.primaryMedium};
  border-radius: ${BORDER_RADIUS} 0 0 ${BORDER_RADIUS};
  background: ${colors.primaryLight};
  font-size: 16px;
  text-decoration: underline;

  > * {
    border-radius: unset;
    border: none;
    height: 100%;
    max-width: unset;
    min-width: unset;
    width: 13px;
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
  transaction: MixedTransaction;
  isFlagged: boolean;
  formControlProps?: {
    isSelected: boolean;
    toggleTransaction: (transaction: MixedTransaction) => void;
  };
}

export default function TransactionCard({ transaction, isFlagged, formControlProps }: Props) {
  const {
    isSub = false,
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
      style={isSub ? { borderStyle: 'dashed', borderColor: colors.primaryMedium } : undefined}
    >
      {isSub && (
        <SubTransactionAccent>
          <InfoIcon color={colors.primary} tooltipContent="Part of a split transaction" portaled>
            s
          </InfoIcon>
        </SubTransactionAccent>
      )}

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
