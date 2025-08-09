import { ReactNode, useState } from 'react';
import styled from 'styled-components';
import colors from '../../../shared/colors';
import zIndices from '../../../shared/zIndices';

const Container = styled.div<{ $color: string }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1em;
  height: 1em;
  min-width: 1em;
  min-height: 1em;
  line-height: 1em;
  border-radius: 50%;
  cursor: pointer;
  font-family: Arial, Helvetica, sans-serif;
  border: 1px solid ${({ $color }) => $color};
  color: ${({ $color }) => $color};

  &:hover {
    && div {
      display: block;
    }
  }
`;

const Tooltip = styled.div<{ $isOpen: boolean }>`
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
  box-sizing: border-box;
  position: absolute;
  z-index: ${zIndices.tooltip};
  top: 100%;
  left: 0;
  width: 300px;
  padding: 5px;
  border-radius: 5px;
  background: #444;
  color: white;
  font-size: 12px;
  font-weight: normal;
  white-space: wrap;
`;

interface Props {
  tooltipContent?: ReactNode;
  theme?: 'error' | 'info';
  color?: string;
}

export default function InfoIcon({
  tooltipContent,
  theme = 'info',
  color = colors.infoIcon,
}: Props) {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const symbol = theme === 'error' ? '!' : '?';

  const toggleTooltip = () => setIsTooltipOpen((isOpen) => !isOpen);

  return (
    <Container $color={color} onClick={toggleTooltip} onMouseLeave={() => setIsTooltipOpen(false)}>
      {symbol}
      {tooltipContent && <Tooltip $isOpen={isTooltipOpen}>{tooltipContent}</Tooltip>}
    </Container>
  );
}
