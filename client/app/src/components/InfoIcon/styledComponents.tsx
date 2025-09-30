import styled from 'styled-components';
import colors from '../../../../shared/colors';
import zIndices from '../../../../shared/zIndices';
import { isDefined } from '../utils/general';
import { TooltipState } from './types';

export type Theme = 'error' | 'info';

const TOOLTIP_WIDTH = 200;
const TOOLTIP_MARGIN = 20;

export const Icon = styled.div<{ $color: string; $theme: Theme }>`
  --even-size: calc(2 * round(calc(1em / 2), 1px));
  --odd-size: calc(var(--even-size) + 1px);
  --icon-size: var(--odd-size);

  width: var(--icon-size);
  height: var(--icon-size);
  min-width: var(--icon-size);
  min-height: var(--icon-size);
  line-height: var(--icon-size);

  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  font-family: Arial, Helvetica, sans-serif;

  border: 1px solid ${({ $color }) => $color};
  color: ${({ $color }) => $color};

  ${({ $theme }) =>
    $theme === 'error' &&
    `
      border-color: red;
      color: red;
      background: ${colors.errorLight};
  `}
`;

export const IconSymbol = styled.div`
  font-size: calc(var(--icon-size) - 2px);
`;

const UnpositionedTooltip = styled.div`
  box-sizing: border-box;
  z-index: ${zIndices.tooltip};
  overflow: auto;
  border-radius: 3px;
  width: ${TOOLTIP_WIDTH}px;
  padding: 10px;
  background: ${colors.tooltip};
  color: white;
  font-size: 12px;
  font-weight: normal;
  white-space: wrap;
`;

export const LocalTooltip = styled(UnpositionedTooltip)<{ $tooltipState: TooltipState }>`
  position: absolute;
  top: 100%;
  left: 0;

  ${({ $tooltipState: { shouldOpenUpward, positions = {} } }) =>
    shouldOpenUpward && isDefined(positions.bottom)
      ? `
          top: unset;
          bottom: 100%;
          max-height: calc(${positions.bottom}px - ${TOOLTIP_MARGIN}px);
        `
      : isDefined(positions.top)
      ? `
          top: 100%;
          max-height: calc(100vh - ${positions.top}px - ${TOOLTIP_MARGIN}px);
        `
      : ''}

  ${({ $tooltipState: { shouldOpenLeft, positions = {} } }) =>
    shouldOpenLeft && isDefined(positions.right)
      ? `
          left: unset;
          right: 0;
          max-width: calc(${positions.right}px - ${TOOLTIP_MARGIN}px);
        `
      : isDefined(positions.left)
      ? `
          left: 0;
          max-width: calc(100vw - ${positions.left}px - ${TOOLTIP_MARGIN}px);
        `
      : ''}
`;

export const PortaledTooltip = styled(UnpositionedTooltip)<{ $tooltipState: TooltipState }>`
  position: fixed;

  ${({ $tooltipState: { shouldOpenUpward, positions = {} } }) =>
    shouldOpenUpward && isDefined(positions.bottom)
      ? `
          bottom: calc(100vh - ${positions.bottom}px);
          max-height: calc(${positions.bottom}px - ${TOOLTIP_MARGIN}px);
        `
      : isDefined(positions.top)
      ? `
          top: ${positions.top}px;
          max-height: calc(100vh - ${positions.top}px - ${TOOLTIP_MARGIN}px);
        `
      : 'display: none;'}

  ${({ $tooltipState: { shouldOpenLeft, positions = {} } }) =>
    shouldOpenLeft && isDefined(positions.right)
      ? `
          right: calc(100vw - ${positions.right}px);
          max-width: calc(${positions.right}px - ${TOOLTIP_MARGIN}px);
        `
      : isDefined(positions.left)
      ? `
          left: ${positions.left}px;
          max-width: calc(100vw - ${positions.left}px - ${TOOLTIP_MARGIN}px);
        `
      : 'display: none;'}
`;
