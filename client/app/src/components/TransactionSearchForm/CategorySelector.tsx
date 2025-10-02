import { Paragraph } from '../../../../shared/styledComponents';
import { HIDDEN_CATEGORIES } from '../../constants';
import { ParentCategory } from '../../types';
import BudgetAutocomplete from '../BudgetAutocomplete';
import InfoIcon from '../InfoIcon';
import LearnMoreParagraph from '../LearnMoreParagraph';
import { FormControlWrapper } from '../styledComponents';

interface Props {
  parentCategories: ParentCategory[];
  selectedParentCategories: ParentCategory[];
  setSelectedParentCategories: (p: ParentCategory[]) => void;
  handleInfoClick: () => void;
}

export default function CategorySelector({
  parentCategories,
  selectedParentCategories,
  setSelectedParentCategories,
  handleInfoClick,
}: Props) {
  return (
    <FormControlWrapper>
      <BudgetAutocomplete
        label={'Select the YNAB parent categories that contain shared costs.'}
        labelDecoration={
          <InfoIcon
            tooltipContent={
              <>
                <Paragraph>
                  Categories you select here should cumulatively include all your shared costs, and
                  each one should include only shared costs. If you mix shared and non-shared
                  transactions in the same categories, switch back to the "Standard" recording
                  method above.
                </Paragraph>

                <LearnMoreParagraph
                  prefix='Otherwise, select all parent categories where you record only shared costs.
                      (If you followed the guide exactly, select your parent category named "Shared
                      Expenses".)'
                  handleInfoClick={handleInfoClick}
                />
              </>
            }
          />
        }
        limit={parentCategories.length}
        placeholder={selectedParentCategories.length ? 'Add more' : 'Add one or more'}
        onSelectionChange={(selected) =>
          setSelectedParentCategories(selected.map(({ data }) => data))
        }
        items={parentCategories
          .filter((cat) => !HIDDEN_CATEGORIES.map(String).includes(cat.name))
          .map((cat) => ({
            id: cat.id,
            displayedContent: cat.name,
            searchableText: cat.name,
            data: cat,
          }))}
      />
    </FormControlWrapper>
  );
}
