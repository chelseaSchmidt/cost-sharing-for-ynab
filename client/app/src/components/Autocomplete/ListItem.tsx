import { ReactNode } from 'react';
import omit from 'lodash/omit';
import styled, { CSSProperties } from 'styled-components';
import { PSEUDO_CSS_KEYS, PseudoCSSProperties } from './types';

type LiProps = {
  $isSelected: boolean;
  $selectedStyle?: CSSProperties & PseudoCSSProperties;
  $disabledStyle?: CSSProperties;
};

export const Li = styled.li<LiProps>`
  all: unset;
  display: block;
  cursor: pointer;
  background: white;

  ${({ $isSelected, $selectedStyle }) =>
    $isSelected
      ? {
          background: 'lightyellow',
          color: 'orange',
          ...omit($selectedStyle, PSEUDO_CSS_KEYS),
        }
      : ''}

  &:hover {
    background: #ddd;
    ${({ $isSelected, $selectedStyle }) =>
      $isSelected ? { background: 'yellow', ...$selectedStyle?.['&:hover'] } : ''}
  }

  &:focus-visible {
    background: #ffffe0;
    ${({ $isSelected, $selectedStyle }) =>
      $isSelected ? { ...$selectedStyle?.['&:focus-visible'] } : ''}
  }

  &[aria-disabled='true'] {
    cursor: not-allowed;
    background: #ccc;
    color: #999;
    ${({ $disabledStyle }) => ({ ...$disabledStyle })}
    ${({ $isSelected, $selectedStyle }) =>
      $isSelected ? { ...$selectedStyle?.['&:disabled'] } : ''}
  }
`;

const StyledLi = styled(Li);

export interface Item<T> {
  id: string;
  displayedContent: ReactNode;
  searchableText: string;
  data: T;
}

export interface ListItemProps<T> {
  children: ReactNode;
  item: Item<T>;
  isSelected: boolean;
  disabled: boolean;
  disabledStyle?: CSSProperties;
  selectedStyle?: CSSProperties & PseudoCSSProperties;
  styledComponents?: {
    ListItem?: typeof Li | typeof StyledLi;
  };
  select: (item: Item<T>) => void;
}

export default function ListItem<T>({
  children,
  item,
  isSelected,
  disabled,
  styledComponents = {},
  disabledStyle,
  selectedStyle,
  select,
}: ListItemProps<T>) {
  return (
    <Li
      role="option"
      id={item.id}
      aria-disabled={disabled}
      onClick={() => !disabled && select(item)}
      onKeyUp={(e) => e.key === 'Enter' && !disabled && select(item)}
      $isSelected={isSelected}
      $selectedStyle={selectedStyle}
      $disabledStyle={disabledStyle}
      as={styledComponents.ListItem}
      tabIndex={0}
    >
      {children}
    </Li>
  );
}
