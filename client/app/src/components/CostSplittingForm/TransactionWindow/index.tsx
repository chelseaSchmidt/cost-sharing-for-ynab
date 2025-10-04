import { CSSProperties } from 'react';
import styled from 'styled-components';
import breakpoints from '../../../../../shared/breakpoints';
import Button from '../../../../../shared/Button';
import {
  FlexColumnAllCentered,
  FlexRowAllCentered,
  Paragraph,
  ScrollableArea,
} from '../../../../../shared/styledComponents';
import { Transaction } from '../../../types';
import Checkbox from '../../Checkbox';
import { LoadingSpinner } from '../../styledComponents';
import { toId } from '../../utils/general';
import TransactionCard from './TransactionCard';

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

const Title = styled.h1`
  all: unset;
  display: block;
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
  accountFlags?: Transaction[];
  containerStyle?: CSSProperties;
  feedStyle?: CSSProperties;
  refreshTransactions?: () => void;
  formControlProps?: {
    selectedIds: Set<string | number>;
    isSelectAllChecked: boolean;
    toggleTransaction: (transaction: Transaction) => void;
    toggleSelectAll: (isSelected: boolean) => void;
  };
}

export default function TransactionWindow({
  loading = false,
  title,
  subtitle,
  transactions,
  accountFlags = [],
  containerStyle,
  feedStyle,
  refreshTransactions,
  formControlProps,
}: Props) {
  const hasTransactions = !!transactions.length;

  return (
    <Container as="section" style={containerStyle}>
      {title && <Title>{title}</Title>}

      {subtitle && <Subtitle>{subtitle}</Subtitle>}

      {refreshTransactions && (
        <Controls>
          <Button onClick={refreshTransactions}>Refresh</Button>
        </Controls>
      )}

      <TransactionArea>
        {loading && (
          <SpinnerPositioner>
            <LoadingSpinner />
          </SpinnerPositioner>
        )}

        {!loading && hasTransactions && formControlProps && (
          <Checkbox
            id="select-all-checkbox"
            label="Select all"
            checked={formControlProps.isSelectAllChecked}
            onChange={formControlProps.toggleSelectAll}
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
              transaction={transaction}
              isFlagged={accountFlags.map(toId).includes(transaction.id)}
              formControlProps={
                formControlProps
                  ? {
                      isSelected: formControlProps.selectedIds.has(transaction.id),
                      toggleTransaction: formControlProps.toggleTransaction,
                    }
                  : undefined
              }
            />
          ))}
        </TransactionFeed>

        {!loading && hasTransactions && <TransactionFeedFade />}
      </TransactionArea>
    </Container>
  );
}
