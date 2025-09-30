import moment from 'moment';
import styled from 'styled-components';
import breakpoints from '../../../shared/breakpoints';
import colors from '../../../shared/colors';
import { Transaction } from '../types';
import InfoIcon from './InfoIcon';

/* Styled Components */

const Container = styled.div<{ $isClickable: boolean; $isSelected: boolean }>`
  display: flex;
  align-items: center;
  border: 1px solid ${colors.lightNeutralAccent};
  border-radius: 3px;
  box-shadow: 0 1px 2px 0 ${colors.lightNeutralBg};
  margin: 0 2px 7px 0;
  padding: 5px;
  background-color: white;
  color: #464b46;

  ${(props) =>
    props.$isClickable &&
    `
      cursor: pointer;
      &:hover {
        background-color: #eee;
      }
      &:active {
        background-color: #ddd;
      }
  `}

  ${({ $isSelected }) => ($isSelected ? `background: ${colors.primaryLight};` : '')}

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 12px;
  }
`;

const Checkbox = styled.input`
  cursor: pointer;
`;

const Date = styled.div`
  flex: 2;
  color: gray;
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
    padding: 5px 0;
  }
`;

const AccountName = styled.div`
  display: flex;
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
  const { date, amount, payee_name, category_name, account_name } = transaction;

  const onClick = () => {
    toggleTransactionSelection?.({
      isSelected: !isSelected,
      transaction,
    });
  };

  return (
    <Container
      onClick={isClickable ? onClick : () => {}}
      $isClickable={isClickable}
      $isSelected={isSelected}
    >
      {isClickable && <Checkbox type="checkbox" checked={isSelected} readOnly />}

      <Date>{moment(date).format('MMM DD, YYYY')}</Date>

      <Amount>
        {Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount / -1000)}
      </Amount>

      <Details>
        <div>{category_name}</div>

        <div>{payee_name}</div>

        <AccountName>
          {account_name}

          {isIsolated && shouldShowIcon && (
            <InfoIcon
              theme="error"
              tooltipContent="You did not mark this account as shared"
              portaled
            />
          )}
        </AccountName>

        {/* TODO: "More" button */}
      </Details>
    </Container>
  );
};

export default TransactionCard;
