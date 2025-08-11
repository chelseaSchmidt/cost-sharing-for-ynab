import { ReactNode, useRef, useState } from 'react';
import styled from 'styled-components';
import colors from '../../../shared/colors';
import zIndices from '../../../shared/zIndices';
import { isDefined } from './utils/general';

const TOOLTIP_WIDTH = 200;
const DEFAULT_MARGIN = 20;

type Bounds = {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};

interface TooltipState {
  isOpen: boolean;
  shouldOpenUpward: boolean;
  shouldOpenLeft: boolean;
  positions?: Bounds;
  margins?: Bounds;
}

/**
 * STYLED COMPONENTS
 */

const Container = styled.div<{ $color: string }>`
  position: relative;
  box-sizing: content-box;
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
`;

/**
 * toggle `visibility` instead of `display` to keep height property always available
 */
const Tooltip = styled.div<{ $tooltipState: TooltipState }>`
  box-sizing: border-box;
  position: absolute;
  z-index: ${zIndices.tooltip};
  top: 100%;
  left: 0;
  width: ${TOOLTIP_WIDTH}px;
  padding: 10px;
  border-radius: 3px;
  background: #444;
  color: white;
  font-size: 12px;
  font-weight: normal;
  white-space: wrap;
  overflow: auto;

  ${({ $tooltipState: { shouldOpenUpward, positions = {}, margins = {} } }) =>
    shouldOpenUpward && isDefined(positions.bottom)
      ? `
          top: unset;
          bottom: 100%;
          max-height: calc(${positions.bottom}px - ${margins.top || DEFAULT_MARGIN}px);
        `
      : isDefined(positions.top)
      ? `
          top: 100%;
          max-height: calc(100vh - ${positions.top}px - ${margins.bottom || DEFAULT_MARGIN}px);
        `
      : ''}

  ${({ $tooltipState: { shouldOpenLeft, positions = {}, margins = {} } }) =>
    shouldOpenLeft && isDefined(positions.right)
      ? `
          left: unset;
          right: 0;
          max-width: calc(${positions.right}px - ${margins.left || DEFAULT_MARGIN}px);
        `
      : isDefined(positions.left)
      ? `
          left: 0;
          max-width: calc(100vw - ${positions.left}px - ${margins.right || DEFAULT_MARGIN}px);
        `
      : ''}

  ${({ $tooltipState: { isOpen } }) =>
    isOpen
      ? 'visibility: visible;'
      : `
          visibility: hidden;
          position: fixed;
          z-index: 0;
          top: 0;
          left: 0;
          bottom: unset;
          right: unset;
          max-height: 100%;
          max-width: 100%;
        `};
`;

/**
 * MAIN
 */

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
  const [tooltipState, setTooltipState] = useState<TooltipState>({
    isOpen: false,
    shouldOpenUpward: false,
    shouldOpenLeft: false,
    positions: {},
    margins: {},
  });

  const iconRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  return (
    <Container
      $color={color}
      ref={iconRef}
      onMouseLeave={() => setTooltipState((prev) => ({ ...prev, isOpen: false }))}
      onMouseEnter={() =>
        setTooltipState((prev) => ({
          ...prev,
          isOpen: true,
          ...getTooltipLocation({ iconRef, tooltipRef }),
        }))
      }
      onClick={() =>
        setTooltipState((prev) => {
          const isOpen = !prev.isOpen;
          return {
            ...prev,
            isOpen,
            ...(isOpen ? getTooltipLocation({ iconRef, tooltipRef }) : {}),
          };
        })
      }
    >
      {theme === 'error' ? '!' : '?'}

      {tooltipContent && (
        <Tooltip $tooltipState={tooltipState} ref={tooltipRef}>
          {tooltipContent}
        </Tooltip>
      )}
    </Container>
  );
}

function getTooltipLocation(args: {
  iconRef: React.RefObject<HTMLDivElement | null>;
  tooltipRef: React.RefObject<HTMLDivElement | null>;
  margins?: Bounds;
}): Omit<TooltipState, 'isOpen'> {
  const HEIGHT_ESTIMATE = 100;

  const { iconRef, tooltipRef, margins } = args;

  const tooltipBounds = tooltipRef.current?.getBoundingClientRect();
  const iconBounds = iconRef.current?.getBoundingClientRect();
  const tooltipHeight = tooltipBounds?.height;
  const tooltipTop = iconBounds?.bottom;
  const tooltipLeft = iconBounds?.left;

  return {
    shouldOpenUpward:
      (isDefined(tooltipTop) ? tooltipTop : 0) >
      window.innerHeight -
        (tooltipHeight || HEIGHT_ESTIMATE) -
        (isDefined(margins?.bottom) ? margins.bottom : DEFAULT_MARGIN),
    shouldOpenLeft:
      (isDefined(tooltipLeft) ? tooltipLeft : 0) >
      window.innerWidth -
        TOOLTIP_WIDTH -
        (isDefined(margins?.right) ? margins.right : DEFAULT_MARGIN),
    positions: {
      top: tooltipTop,
      bottom: iconBounds?.top,
      left: tooltipLeft,
      right: iconBounds?.right,
    },
  };
}
