import { Account } from '../../types';
import BudgetAutocomplete from '../BudgetAutocomplete';
import InfoIcon from '../InfoIcon';
import { FormControlWrapper } from '../styledComponents';

interface Props {
  accounts: Account[];
  selectedAccounts: Account[];
  setSelectedAccounts: (a: Account[]) => void;
}

export default function AccountSelector({
  accounts,
  selectedAccounts,
  setSelectedAccounts,
}: Props) {
  return (
    <FormControlWrapper>
      <BudgetAutocomplete
        label={'Select the YNAB accounts that contain shared costs.'}
        labelDecoration={
          <InfoIcon tooltipContent="This might be one or more shared credit cards or bank accounts." />
        }
        limit={accounts.length}
        placeholder={selectedAccounts.length ? 'Add more' : 'Add one or more'}
        onSelectionChange={(selected) => setSelectedAccounts(selected.map(({ data }) => data))}
        items={accounts.map((acct) => ({
          id: acct.id,
          displayedContent: acct.name,
          searchableText: acct.name,
          data: acct,
        }))}
      />
    </FormControlWrapper>
  );
}
