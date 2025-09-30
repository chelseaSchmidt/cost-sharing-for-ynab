import styled from 'styled-components';
import TransactionCard from './TransactionCard';
import {
  FlexColumnAllCentered,
  FlexRowAllCentered,
  LoadingSpinner,
  Paragraph,
  ScrollableArea,
} from '../styledComponents';
import { toId } from '../utils/general';
import breakpoints from '../../../../shared/breakpoints';
import { Button } from '../../../../shared/styledComponents';
import { Transaction } from '../../types';
import { CSSProperties } from 'react';
import Checkbox from '../Checkbox';

const FEED_PADDING_Y_LG = '30px';
const FEED_PADDING_Y_SM = '10px';

/* Styled Components */

const Container = styled(FlexColumnAllCentered)`
  box-sizing: border-box;
  flex: 1;
  width: 100%;
  overflow: hidden;
  gap: 15px;
`;

const Title = styled.header`
  text-align: center;
  font-weight: bold;
  font-size: 1.3em;
`;

const Subtitle = styled(Paragraph)`
  text-align: center;
`;

const Controls = styled(FlexRowAllCentered)`
  width: 100%;
`;

const RefreshButton = styled(Button)`
  width: fit-content;
`;

const SpinnerPositioner = styled(FlexColumnAllCentered)`
  position: absolute;
  width: 100%;
`;

const TransactionArea = styled(FlexColumnAllCentered)`
  position: relative;
  flex: 1;
  width: 100%;
  overflow: hidden;
  gap: 15px;
`;

const TransactionFeed = styled(ScrollableArea)`
  box-sizing: border-box;
  width: 100%;
  padding: ${FEED_PADDING_Y_LG} 30px;

  @media (max-width: ${breakpoints.mobile}) {
    padding: ${FEED_PADDING_Y_SM} 5px;
  }

  @media (max-width: ${breakpoints.tiny}) {
    padding: ${FEED_PADDING_Y_SM} 5px;
  }
`;

const TransactionFeedFade = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(to top, white, transparent);
  margin-bottom: 1px;
  height: ${FEED_PADDING_Y_LG};

  @media (max-width: ${breakpoints.mobile}) {
    height: ${FEED_PADDING_Y_SM};
  }

  @media (max-width: ${breakpoints.tiny}) {
    height: ${FEED_PADDING_Y_SM};
  }
`;

/* Main Component */

interface Props {
  loading?: boolean;
  title?: string;
  subtitle?: string;
  transactions: Transaction[];
  selectedTransactions?: Transaction[];
  transactionsSharedInOneButNotOther?: Transaction[];
  toggleTransactionSelection?: (options: { isSelected: boolean; transaction: Transaction }) => void;
  toggleSelectAll?: (options: { isSelected: boolean }) => void;
  isSelectAllChecked?: boolean;
  shouldShowIcon?: boolean;
  isClickable?: boolean;
  shouldShowRefreshButton?: boolean;
  refreshTransactions?: () => void;
  containerStyle?: CSSProperties;
  feedStyle?: CSSProperties;
}

const TransactionWindow = ({
  loading = false,
  title,
  subtitle = '',
  transactions,
  selectedTransactions = [],
  transactionsSharedInOneButNotOther = [],
  toggleTransactionSelection,
  toggleSelectAll,
  isSelectAllChecked,
  shouldShowIcon = false,
  isClickable = false,
  shouldShowRefreshButton = false,
  refreshTransactions = () => {},
  containerStyle = {},
  feedStyle = {},
}: Props) => {
  const isolatedTransactionIds = transactionsSharedInOneButNotOther.map(toId);
  const selectedTransactionIds = selectedTransactions.map(toId);
  const hasTransactions = !!transactions.length;

  return (
    <Container style={containerStyle}>
      {title && <Title>{title}</Title>}

      {subtitle && <Subtitle>{subtitle}</Subtitle>}

      {shouldShowRefreshButton && (
        <Controls>
          <RefreshButton type="button" onClick={refreshTransactions}>
            Refresh
          </RefreshButton>
        </Controls>
      )}

      <TransactionArea>
        {loading && (
          <SpinnerPositioner>
            <LoadingSpinner />
          </SpinnerPositioner>
        )}

        {!loading && hasTransactions && isClickable && toggleSelectAll && (
          <Checkbox
            id="select-all-checkbox"
            label="Select all"
            checked={!!isSelectAllChecked}
            onChange={(isSelected) => toggleSelectAll({ isSelected })}
          />
        )}

        {!loading && !hasTransactions && <em>No transactions</em>}

        <TransactionFeed
          style={{
            ...feedStyle,
            visibility: !loading && hasTransactions ? 'visible' : 'hidden',
          }}
        >
          {transactions.map((transaction) => (
            <TransactionCard
              key={transaction.id}
              isClickable={isClickable}
              isSelected={!!selectedTransactionIds.includes(transaction.id)}
              toggleTransactionSelection={toggleTransactionSelection}
              transaction={transaction}
              isIsolated={!!isolatedTransactionIds.includes(transaction.id)}
              shouldShowIcon={shouldShowIcon}
            />
          ))}
        </TransactionFeed>

        {!loading && hasTransactions && <TransactionFeedFade />}
      </TransactionArea>
    </Container>
  );
};

export default TransactionWindow;
