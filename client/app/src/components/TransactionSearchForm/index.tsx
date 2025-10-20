import { useState } from 'react';
import Button from '../../../../shared/Button';
import { TRANSACTION_SELECTION_FORM_ID } from '../../constants';
import { Account, Mode, ParentCategory } from '../../types';
import InfoIcon from '../InfoIcon';
import { SectionHeader, SectionTile } from '../styledComponents';
import AccountSelector from './AccountSelector';
import CategorySelector from './CategorySelector';
import DateRangeSelector, { DateError, DateRange } from './DateRangeSelector';
import IouAccountSelector from './IouAccountSelector';
import ModeSelector from './ModeSelector';

interface Props {
  accounts: Account[];
  selectedAccounts: Account[];
  setSelectedAccounts: (a: Account[]) => void;
  parentCategories: ParentCategory[];
  selectedParentCategories: ParentCategory[];
  setSelectedParentCategories: (p: ParentCategory[]) => void;
  iouAccountId: string;
  setIouAccountId: (id: string) => void;
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
  iouAccountId,
  setIouAccountId,
  dateRange,
  setDateRange,
  handleInfoClick,
  onSubmit,
}: Props) {
  const [mode, setMode] = useState(Mode.STANDARD);
  const [dateError, setDateError] = useState<DateError>(null);

  const isSubmitDisabled = !!dateError || !iouAccountId || !selectedAccounts.length;

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

      <IouAccountSelector accounts={accounts} setAccountId={setIouAccountId} />

      <DateRangeSelector
        dateRange={dateRange}
        setDateRange={setDateRange}
        dateError={dateError}
        setDateError={setDateError}
      />

      <Button
        type="submit"
        disabled={isSubmitDisabled}
        onClick={(e) => {
          e.preventDefault();
          onSubmit();
          document.getElementById(TRANSACTION_SELECTION_FORM_ID)?.scrollIntoView(true);
        }}
      >
        {isSubmitDisabled ? (
          <>
            Find transactions&nbsp;
            <InfoIcon color="white" tooltipContent="Fill out the fields above to enable" />
          </>
        ) : (
          'Find transactions'
        )}
      </Button>
    </SectionTile>
  );
}
