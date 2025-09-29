import { CSSProperties } from 'react';
import omit from 'lodash/omit';
import styled from 'styled-components';
import { PSEUDO_CSS_KEYS, PseudoCSSProperties } from './types';

export const DELETE_BUTTON_CLASS = 'autocomplete-delete-button';
export const DELETE_ICON_LINE_CLASS = 'autocomplete-delete-icon-line';

type ContainerProps = {
  $expanded: boolean;
  $deleteIconLineStyle?: CSSProperties & PseudoCSSProperties;
};

export const Container = styled.div<ContainerProps>`
  position: relative;
  box-sizing: border-box;
  width: 100%;

  ${({ $expanded }) => ($expanded ? 'z-index: 2;' : '')}

  .${DELETE_BUTTON_CLASS} {
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

export const LabelContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: center;
`;

export const Label = styled.label`
  box-sizing: border-box;
  display: block;
  width: fit-content;
  cursor: pointer;
`;

export const InteractiveElements = styled.div`
  box-sizing: border-box;
  position: relative;
`;

export const InputWrapper = styled.div`
  box-sizing: border-box;
  width: 100%;
  display: flex;
  border: 1px solid black;
`;

export const InputArea = styled.div`
  box-sizing: border-box;
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  max-width: 100%;
`;

export const Input = styled.input`
  box-sizing: border-box;
  display: flex;
  flex: 1;
  min-width: 100px;
  max-width: 100%;
  padding: 8px;
  margin: 0;
  border: none;
  font-size: inherit;
  white-space: nowrap;
`;

export const SelectedInputsArea = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  overflow: hidden;
`;

export const SelectedInputPill = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  border: 1px solid black;
  max-width: 100%;
`;

export const PillContent = styled.div`
  box-sizing: border-box;
  display: block;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

type ListProps = {
  $shouldOpenUpward: boolean;
  $top: number | null;
  $bottom: number | null;
  $topMargin?: number;
  $bottomMargin?: number;
};

export const List = styled.ul<ListProps>`
  box-sizing: border-box;
  position: absolute;
  left: 0;
  width: 100%;
  border: 1px solid black;
  padding: 0;
  margin: 0;
  overflow: auto;

  ${({ $shouldOpenUpward, $top, $bottom, $topMargin = 10, $bottomMargin = 10 }) =>
    $shouldOpenUpward && $bottom !== null
      ? `bottom: 100%; max-height: calc(${$bottom}px - ${$topMargin}px);`
      : $top !== null
      ? `top: 100%; max-height: calc(100vh - ${$top}px - ${$bottomMargin}px);`
      : ''}
`;
