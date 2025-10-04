import { ReactNode } from 'react';
import styled from 'styled-components';
import breakpoints from '../../../shared/breakpoints';
import Button from '../../../shared/Button';
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

const OptionButton = styled(Button)<{ $isSelected: boolean }>`
  background: unset;
  box-shadow: unset;
  border-radius: unset;
  font-family: inherit;
  color: inherit;
  letter-spacing: unset;
  padding: 15px 10px;
  flex-direction: column;
  max-width: 300px;
  border: 1px solid ${colors.lightNeutralAccent};
  border-right: none;

  @media (max-width: ${breakpoints.mobile}) {
    width: 100%;
  }

  &:first-child {
    border-radius: 5px 0 0 5px;
    ${({ $isSelected }) => ($isSelected ? SELECTED_STYLE : '')}

    @media (max-width: ${breakpoints.mobile}) {
      border-right: 1px solid ${colors.lightNeutralAccent};
      border-radius: 5px 5px 0 0;
      ${({ $isSelected }) => ($isSelected ? SELECTED_STYLE : '')}
    }
  }

  &:last-child {
    border-radius: 0 5px 5px 0;
    border-right: 1px solid ${colors.lightNeutralAccent};
    ${({ $isSelected }) => ($isSelected ? SELECTED_STYLE : '')}

    @media (max-width: ${breakpoints.mobile}) {
      border-radius: 0 0 5px 5px;
    }
  }

  &:hover {
    background: ${colors.primaryMedium};
  }
`;

export interface Option<T extends string> {
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
        <OptionButton
          key={option.value}
          onClick={() => onChange(option.value)}
          $isSelected={selected === option.value}
        >
          {option.displayedContent}
        </OptionButton>
      ))}
    </Container>
  );
}
