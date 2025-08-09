import { ReactNode } from 'react';
import styled from 'styled-components';
import breakpoints from '../../../shared/breakpoints';
import colors from '../../../shared/colors';

const SELECTED_STYLE = `
  border: 2px solid ${colors.primary};
  background: ${colors.primaryLight};
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  width: fit-content;
  border-radius: 5px;

  @media (max-width: ${breakpoints.mobile}) {
    width: 100%;
    flex-direction: column;
  }
`;

const OptionContainer = styled.button<{ $isSelected: boolean }>`
  all: unset;
  cursor: pointer;
  box-sizing: border-box;
  padding: 15px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 300px;
  border-top: 1px solid ${colors.lightNeutralAccent};
  border-bottom: 1px solid ${colors.lightNeutralAccent};
  border-left: 1px solid ${colors.lightNeutralAccent};
  text-align: center;

  @media (max-width: ${breakpoints.mobile}) {
    width: 100%;
  }

  ${({ $isSelected }) => ($isSelected ? SELECTED_STYLE : '')}

  &:first-child {
    border-radius: 5px 0 0 5px;

    @media (max-width: ${breakpoints.mobile}) {
      border-right: 1px solid ${colors.lightNeutralAccent};
      border-radius: 5px 5px 0 0;
      ${({ $isSelected }) => ($isSelected ? SELECTED_STYLE : '')}
    }
  }

  &:last-child {
    border-radius: 0 5px 5px 0;
    border-right: 1px solid ${colors.lightNeutralAccent};

    @media (max-width: ${breakpoints.mobile}) {
      border-radius: 0 0 5px 5px;
    }

    ${({ $isSelected }) => ($isSelected ? SELECTED_STYLE : '')}
  }

  &:hover {
    background: ${colors.primaryMedium};
  }

  &:active {
    background: ${colors.buttonActive};
  }

  &:focus-visible {
    outline: 1px solid ${colors.buttonFocusOutline};
  }
`;

interface Option<T extends string> {
  value: T;
  displayedContent: ReactNode;
}

interface Props<T extends string> {
  options: Option<T>[];
  selected: T;
  onChange: (value: T) => void;
}

export default function Switch<T extends string>({ options, selected, onChange }: Props<T>) {
  return (
    <Container>
      {options.map((option) => (
        <OptionContainer
          onClick={() => onChange(option.value)}
          $isSelected={selected === option.value}
        >
          {option.displayedContent}
        </OptionContainer>
      ))}
    </Container>
  );
}
