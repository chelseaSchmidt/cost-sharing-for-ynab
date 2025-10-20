import { Account } from '../../types';
import BudgetAutocomplete from '../BudgetAutocomplete';
import InfoIcon from '../InfoIcon';
import { FormControlWrapper } from '../styledComponents';

interface Props {
  accounts: Account[];
  setAccountId: (id: string) => void;
}

export default function IouAccountSelector({ accounts, setAccountId }: Props) {
  return (
    <FormControlWrapper>
      <BudgetAutocomplete
        label={'Select the "IOU" account that tracks what you are owed.'}
        limit={1}
        onSelectionChange={([selectedAccount]) => setAccountId(selectedAccount?.id || '')}
        placeholder="Add one"
        labelDecoration={
          <InfoIcon
            tooltipContent={
              'This account tracks what you are owed from the person sharing an account with you. To create it in YNAB, click "Add Account", then "Add an Unlinked Account", and nickname it something like "Owed from [person\'s name]." The account type should be Checking, Savings, or Cash.'
            }
          />
        }
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
