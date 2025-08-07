import { CSSProperties } from 'react';
import omit from 'lodash/omit';
import styled from 'styled-components';
import { PSEUDO_CSS_KEYS, PseudoCSSProperties } from './types';

export const DELETE_BUTTON_CLASS = 'autocomplete-delete-button';
export const DELETE_ICON_LINE_CLASS = 'autocomplete-delete-icon-line';

export const Container = styled.div<{ $deleteIconLineStyle?: CSSProperties & PseudoCSSProperties }>`
  position: relative;
  box-sizing: border-box;
  width: 100%;

  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }

  .${DELETE_BUTTON_CLASS} {
    box-sizing: border-box;
    padding: 5px;

    &:hover {
      .${DELETE_ICON_LINE_CLASS} {
        ${({ $deleteIconLineStyle }) => ({ ...$deleteIconLineStyle?.['&:hover'] })}
      }
    }

    &:disabled {
      .${DELETE_ICON_LINE_CLASS} {
        ${({ $deleteIconLineStyle }) => ({ ...$deleteIconLineStyle?.['&:disabled'] })}
      }
    }

    &:focus-visible {
      .${DELETE_ICON_LINE_CLASS} {
        ${({ $deleteIconLineStyle }) => ({ ...$deleteIconLineStyle?.['&:focus-visible'] })}
      }
    }
  }

  .${DELETE_ICON_LINE_CLASS} {
    ${({ $deleteIconLineStyle }) => omit($deleteIconLineStyle, PSEUDO_CSS_KEYS)}
  }
`;

export const Label = styled.label`
  display: block;
  width: fit-content;
`;

export const InteractiveElements = styled.div`
  position: relative;
`;

export const InputWrapper = styled.div`
  width: 100%;
  display: flex;
  border: 1px solid black;
`;

export const InputArea = styled.div`
  display: flex;
  flex: 1;
  flex-wrap: wrap;
`;

export const Input = styled.input`
  display: flex;
  flex: 1;
  min-width: 100px;
  padding: 8px;
  border: none;
  font-size: inherit;
  white-space: nowrap;
`;

export const SelectedInputsArea = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  overflow: hidden;
`;

export const SelectedInputPill = styled.div`
  display: flex;
  border: 1px solid black;
`;

export const PillContent = styled.div`
  display: block;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const List = styled.ul<{ $top: number | null }>`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  border: 1px solid black;
  overflow: auto;
  min-height: 100px;

  ${({ $top }) => ($top ? `max-height: calc(100vh - ${$top}px - 10px);` : '')}
`;
