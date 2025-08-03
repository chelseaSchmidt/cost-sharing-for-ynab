import styled from 'styled-components';
import { OptionButton, SelectedOptionButton } from './styledComponents';
import { Category, ParentCategory } from '../types';

/* Styled Components */

const Container = styled.div``;

/* Main Component */

interface Props {
  parentCategories: ParentCategory[];
  selectedParentCategories: ParentCategory[];
  setSelectedParentCategories: (pc: ParentCategory[]) => void;
}

const CategoryButtons = ({
  parentCategories,
  selectedParentCategories,
  setSelectedParentCategories,
}: Props) => {
  const hiddenCategoryNames = [
    'Internal Master Category',
    'Credit Card Payments',
    'Hidden Categories',
  ];

  const doesCategoryHaveId = (category: ParentCategory, id?: string) => category.id === id;

  const selectCategory = (selection: ParentCategory) =>
    setSelectedParentCategories([...selectedParentCategories, selection]);

  const deselectCategoryById = (id: string) =>
    setSelectedParentCategories(
      selectedParentCategories.filter((category) => !doesCategoryHaveId(category, id)),
    );

  const toggleSharedCategory = ({ id, name, categories }: ParentCategory) => {
    if (selectedParentCategories.find((category) => doesCategoryHaveId(category, id))) {
      deselectCategoryById(id);
    } else {
      selectCategory({ name, id, categories });
    }
  };

  return (
    <Container>
      {parentCategories.map(({ name, id, categories }) => {
        const shouldDisplayCategory = !hiddenCategoryNames.includes(name);

        if (shouldDisplayCategory) {
          const isCategorySelected = selectedParentCategories.find((category) =>
            doesCategoryHaveId(category, id),
          );

          const Button = isCategorySelected ? SelectedOptionButton : OptionButton;

          return (
            <Button
              type="button"
              key={id}
              id={id}
              onClick={() => toggleSharedCategory({ id, name, categories })}
            >
              {name}
            </Button>
          );
        }

        return null;
      })}
    </Container>
  );
};

export default CategoryButtons;
