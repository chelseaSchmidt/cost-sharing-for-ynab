import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { OptionButton, SelectedOptionButton } from './styledComponents';

/* Styled Components */

const Container = styled.div``;

/* Main Component */

const CategoryButtons = ({
  parentCategories,
  selectedParentCategories,
  setSelectedParentCategories,
}) => {
  const hiddenCategoryNames = [
    'Internal Master Category',
    'Credit Card Payments',
    'Hidden Categories',
  ];

  const doesCategoryHaveId = ({ categoryId }, id) => (
    categoryId === id
  );

  const selectCategory = (selection) => (
    setSelectedParentCategories([...selectedParentCategories, selection])
  );

  const deselectCategoryById = (id) => (
    setSelectedParentCategories(
      selectedParentCategories.filter((category) => !doesCategoryHaveId(category, id)),
    )
  );

  const toggleSharedCategory = ({
    id,
    name,
    subCategories,
  }) => {
    if (selectedParentCategories.find((category) => doesCategoryHaveId(category, id))) {
      deselectCategoryById(id);
    } else {
      selectCategory({ name, categoryId: id, subCategories });
    }
  };

  return (
    <Container>
      {
        parentCategories.map(({
          name,
          id,
          categories: subCategories,
        }) => {
          const shouldDisplayCategory = !hiddenCategoryNames.includes(name);

          if (shouldDisplayCategory) {
            const isCategorySelected = selectedParentCategories.find(
              (category) => doesCategoryHaveId(category, id),
            );

            const Button = isCategorySelected
              ? SelectedOptionButton
              : OptionButton;

            return (
              <Button
                type="button"
                key={id}
                id={id}
                onClick={() => toggleSharedCategory({ id, name, subCategories })}
              >
                {name}
              </Button>
            );
          }

          return null;
        })
      }
    </Container>
  );
};

CategoryButtons.propTypes = {
  parentCategories: PropTypes.array.isRequired,
  selectedParentCategories: PropTypes.array.isRequired,
  setSelectedParentCategories: PropTypes.func.isRequired,
};

export default CategoryButtons;
