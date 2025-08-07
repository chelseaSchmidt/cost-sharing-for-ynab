import { CSSProperties, ReactNode, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Button, { StyledButton } from './Button';
import DeleteIcon from './DeleteIcon';
import ListItem, { Item, Li, ListItemProps } from './ListItem';
import {
  Container,
  DELETE_BUTTON_CLASS,
  Input,
  InputArea,
  InputWrapper,
  InteractiveElements,
  Label,
  List,
  PillContent,
  SelectedInputPill,
  SelectedInputsArea,
} from './styledComponents';
import { PseudoCSSProperties } from './types';

const StyledContainer = styled(Container);
const StyledInteractiveElements = styled(InteractiveElements);
const StyledInput = styled(Input);
const StyledInputWrapper = styled(InputWrapper);
const StyledLabel = styled(Label);
const StyledList = styled(List);
const StyledSelectedInputPill = styled(SelectedInputPill);
const RestyledButton = styled(StyledButton);
const StyledLi = styled(Li);

const NoItemText = styled.div`
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

type SelectedItems<T> = { [key: string]: Item<T> | null };

export interface AutocompleteProps<T> {
  label: ReactNode;
  labelText: string;
  items: Item<T>[];
  limit: number;
  placeholder: string;
  shouldHideSelected?: boolean;
  noItemsText?: string;
  disabledItemStyle?: ListItemProps<T>['disabledStyle'];
  selectedItemStyle?: ListItemProps<T>['selectedStyle'];
  deleteIconLineStyle?: CSSProperties & PseudoCSSProperties;
  deleteIconSize?: number;
  styledComponents?: {
    Container?: typeof Container | typeof StyledContainer;
    Label?: typeof Label | typeof StyledLabel;
    InteractiveElements?: typeof InteractiveElements | typeof StyledInteractiveElements;
    Input?: typeof Input | typeof StyledInput;
    InputWrapper?: typeof InputWrapper | typeof StyledInputWrapper;
    SelectedInputPill?: typeof SelectedInputPill | typeof StyledSelectedInputPill;
    PillDeleteButton?: typeof StyledButton | typeof RestyledButton;
    ResetButton?: typeof StyledButton | typeof RestyledButton;
    List?: typeof List | typeof StyledList;
    ListItem?: typeof Li | typeof StyledLi;
  };
  onSelectionChange: (selectedItems: Item<T>[]) => void;
}

export default function Autocomplete<T>({
  label,
  labelText,
  items,
  limit,
  placeholder,
  shouldHideSelected = false,
  noItemsText = 'No matches found',
  disabledItemStyle,
  selectedItemStyle,
  deleteIconLineStyle,
  deleteIconSize,
  styledComponents = {},
  onSelectionChange,
}: AutocompleteProps<T>) {
  const [inputValue, setInputValue] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [selectedItems, setSelectedItems] = useState<SelectedItems<T>>({});
  const [listboxPosition, setListboxPosition] = useState<{
    shouldOpenUpward: boolean;
    top: number | null;
    bottom: number | null;
  }>({ shouldOpenUpward: false, top: null, bottom: null });

  const inputWrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const LABEL_ID = `label-${labelText}`;
  const COMBOBOX_ID = `combobox-${labelText}`;
  const LISTBOX_ID = `listbox-${labelText}`;

  const displayedItems = filterItems(items, inputValue, {
    shouldIncludeSelected: !shouldHideSelected,
    selectedItems,
  });

  const selectedItemCount = countSelections(selectedItems);

  const closeMenu = () => {
    setExpanded(false);
    setInputValue('');
  };

  const openMenu = () => {
    setListboxPosition(getListboxPosition(inputWrapperRef));
    setExpanded(true);
  };

  useEffect(() => {
    onSelectionChange(Object.values(selectedItems).filter((item) => !!item));
  }, [selectedItems]);

  return (
    <Container
      as={styledComponents.Container}
      $deleteIconLineStyle={deleteIconLineStyle}
      onKeyUp={(e) => e.key === 'Escape' && closeMenu()}
    >
      <Label as={styledComponents.Label} id={LABEL_ID} htmlFor={COMBOBOX_ID}>
        {label}
      </Label>

      <InteractiveElements
        as={styledComponents.InteractiveElements}
        onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && closeMenu()}
      >
        <InputWrapper as={styledComponents.InputWrapper} ref={inputWrapperRef}>
          <InputArea>
            <SelectedInputsArea>
              {Object.values(selectedItems)
                .filter((item) => !!item)
                .map((item) => (
                  <SelectedInputPill
                    key={item.id}
                    as={styledComponents.SelectedInputPill}
                    tabIndex={0}
                  >
                    <PillContent>{item.displayedContent}</PillContent>
                    <Button
                      className={DELETE_BUTTON_CLASS}
                      styledContainer={styledComponents.PillDeleteButton}
                      onClick={() => {
                        setSelectedItems({ ...selectedItems, [item.id]: null });
                        inputRef.current?.focus();
                      }}
                      tabIndex={0}
                    >
                      <DeleteIcon size={deleteIconSize} />
                    </Button>
                  </SelectedInputPill>
                ))}
            </SelectedInputsArea>

            <Input
              type="text"
              role="combobox"
              aria-autocomplete="list"
              aria-haspopup="listbox"
              as={styledComponents.Input}
              ref={inputRef}
              id={COMBOBOX_ID}
              aria-controls={LISTBOX_ID}
              aria-expanded={expanded}
              placeholder={selectedItemCount >= Math.max(1, limit) ? undefined : placeholder}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={openMenu}
              tabIndex={0}
            />
          </InputArea>

          <Button
            className={DELETE_BUTTON_CLASS}
            styledContainer={styledComponents.ResetButton}
            onClick={() => {
              setSelectedItems({});
              closeMenu();
            }}
            disabled={!selectedItemCount && !inputValue}
            tabIndex={0}
          >
            <DeleteIcon size={deleteIconSize} />
          </Button>
        </InputWrapper>

        <List
          role="listbox"
          as={styledComponents.List}
          id={LISTBOX_ID}
          aria-labelledby={LABEL_ID}
          $shouldOpenUpward={listboxPosition.shouldOpenUpward}
          $top={listboxPosition.top}
          $bottom={listboxPosition.bottom}
          style={{ display: expanded ? undefined : 'none' }}
        >
          {displayedItems.length ? (
            displayedItems.map((item) => (
              <ListItem
                key={item.id}
                item={item}
                isSelected={!!selectedItems[item.id]}
                disabled={!selectedItems[item.id] && selectedItemCount >= limit}
                styledComponents={styledComponents}
                disabledStyle={disabledItemStyle}
                selectedStyle={selectedItemStyle}
                select={(item) => {
                  if (selectedItems[item.id]) {
                    setSelectedItems({ ...selectedItems, [item.id]: null });
                  } else {
                    const updatedItems = { ...selectedItems, [item.id]: item };
                    setSelectedItems(updatedItems);
                    setInputValue('');
                    if (selectedItemCount >= limit) {
                      closeMenu();
                    }
                  }
                }}
              >
                {item.displayedContent}
              </ListItem>
            ))
          ) : (
            <ListItem
              key="no-items"
              item={{ id: 'no-items', displayedContent: '', searchableText: '', data: {} }}
              isSelected={false}
              disabled
              styledComponents={styledComponents}
              disabledStyle={disabledItemStyle}
              select={() => {}}
            >
              <NoItemText>{noItemsText}</NoItemText>
            </ListItem>
          )}
        </List>
      </InteractiveElements>
    </Container>
  );
}

function filterItems<T>(
  items: Item<T>[],
  searchedText: string,
  options: {
    shouldIncludeSelected?: boolean;
    selectedItems?: SelectedItems<T>;
  } = {},
) {
  const { shouldIncludeSelected = true, selectedItems = {} } = options;

  return items.filter(
    (item) =>
      item.searchableText.trim().toLowerCase().includes(searchedText.trim().toLowerCase()) &&
      (shouldIncludeSelected || !selectedItems[item.id]),
  );
}

function countSelections<T>(selectedItems: SelectedItems<T>): number {
  return Object.values(selectedItems).reduce((sum, item) => {
    return item ? sum + 1 : sum;
  }, 0);
}

function getListboxPosition(inputWrapperRef: React.RefObject<HTMLDivElement | null>) {
  const inputWrapperBounds = inputWrapperRef.current?.getBoundingClientRect();
  const listboxTop = inputWrapperBounds?.bottom || null;

  return {
    shouldOpenUpward: (listboxTop || 0) > window.innerHeight - 100,
    top: listboxTop,
    bottom: inputWrapperBounds?.top || null,
  };
}
