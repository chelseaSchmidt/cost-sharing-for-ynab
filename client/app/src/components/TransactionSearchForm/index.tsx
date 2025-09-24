import { useState } from 'react';
import { Moment } from 'moment';
import { Button } from '../../../../shared/styledComponents';
import { TRANSACTION_SELECTION_FORM_ID } from '../../constants';
import { Account, Mode, ParentCategory } from '../../types';
import { SectionHeader, SectionTile } from '../styledComponents';
import AccountSelector from './AccountSelector';
import CategorySelector from './CategorySelector';
import DateRangeSelector, { DateRange } from './DateRangeSelector';
import ModeSelector from './ModeSelector';

interface Props {
  accounts: Account[];
  selectedAccounts: Account[];
  setSelectedAccounts: (a: Account[]) => void;
  parentCategories: ParentCategory[];
  selectedParentCategories: ParentCategory[];
  setSelectedParentCategories: (p: ParentCategory[]) => void;
  dateRange: DateRange;
  setDateRange: (d: DateRange) => void;
  handleInfoClick: () => void;
  onSubmit: () => void;
}

export default function TransactionSearchForm({
  accounts,
  selectedAccounts,
  setSelectedAccounts,
  parentCategories,
  selectedParentCategories,
  setSelectedParentCategories,
  dateRange,
  setDateRange,
  handleInfoClick,
  onSubmit,
}: Props) {
  const [mode, setMode] = useState(Mode.STANDARD);

  return (
    <SectionTile as="form">
      <SectionHeader>Find Transactions</SectionHeader>

      <ModeSelector
        mode={mode}
        changeMode={(mode: Mode) => {
          setMode(mode);
          if (mode !== Mode.ADVANCED) setSelectedParentCategories([]);
        }}
        handleInfoClick={handleInfoClick}
      />

      <AccountSelector
        accounts={accounts}
        selectedAccounts={selectedAccounts}
        setSelectedAccounts={setSelectedAccounts}
      />

      {mode === Mode.ADVANCED && (
        <CategorySelector
          parentCategories={parentCategories}
          selectedParentCategories={selectedParentCategories}
          setSelectedParentCategories={setSelectedParentCategories}
          handleInfoClick={handleInfoClick}
        />
      )}

      <DateRangeSelector dateRange={dateRange} setDateRange={setDateRange} />

      <Button
        type="submit"
        onClick={(e) => {
          e.preventDefault();
          onSubmit();
          document.getElementById(TRANSACTION_SELECTION_FORM_ID)?.scrollIntoView(true);
        }}
      >
        Find transactions
      </Button>
    </SectionTile>
  );
}
