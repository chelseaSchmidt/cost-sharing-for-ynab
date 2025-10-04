import { ReactNode, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import colors from '../../../../shared/colors';
import { HEADER_MAX_HEIGHT } from '../../../../shared/Header';
import { LocalTooltip, PortaledTooltip, Icon, Theme, IconSymbol } from './styledComponents';
import { TooltipState } from './types';

interface Props {
  tooltipContent?: ReactNode;
  theme?: Theme;
  color?: string;
  portaled?: boolean;
}

export default function InfoIcon({
  tooltipContent,
  theme = 'info',
  color = colors.infoIcon,
  portaled = false,
}: Props) {
  const [tooltipState, setTooltipState] = useState<TooltipState>({
    isOpen: false,
    shouldOpenUpward: false,
    shouldOpenLeft: false,
    positions: {},
  });

  const iconRef = useRef<HTMLDivElement>(null);

  const closeTooltip = () => {
    if (tooltipContent) setTooltipState((prev) => ({ ...prev, isOpen: false }));
  };

  const openTooltip = () => {
    if (tooltipContent)
      setTooltipState((prev) => ({ ...prev, isOpen: true, ...getTooltipLocation(iconRef) }));
  };

  const toggleTooltip = () => {
    if (tooltipContent)
      setTooltipState((prev) => {
        const isOpen = !prev.isOpen;
        return { ...prev, isOpen, ...(isOpen ? getTooltipLocation(iconRef) : {}) };
      });
  };

  return (
    <Icon
      $theme={theme}
      $color={color}
      ref={iconRef}
      onMouseEnter={openTooltip}
      onMouseLeave={closeTooltip}
      onClick={(e) => {
        if (tooltipContent) e.stopPropagation();
      }}
      onTouchStart={(e) => {
        if (tooltipContent) e.stopPropagation();
        toggleTooltip();
      }}
    >
      <IconSymbol>{theme === 'error' ? '!' : '?'}</IconSymbol>

      {tooltipState.isOpen &&
        tooltipContent &&
        (portaled ? (
          ReactDOM.createPortal(
            <PortaledTooltip $tooltipState={tooltipState}>{tooltipContent}</PortaledTooltip>,
            document.body,
          )
        ) : (
          <LocalTooltip $tooltipState={tooltipState}>{tooltipContent}</LocalTooltip>
        ))}
    </Icon>
  );
}

function getTooltipLocation(
  iconRef: React.RefObject<HTMLDivElement | null>,
): Omit<TooltipState, 'isOpen'> {
  const {
    left: iconLeft,
    right: iconRight,
    top: iconTop,
    bottom: iconBottom,
  } = iconRef.current?.getBoundingClientRect() || {};

  const topAvailable = (iconTop || 0) - HEADER_MAX_HEIGHT;
  const bottomAvailable = window.innerHeight - (iconBottom || 0);
  const leftAvailable = iconLeft || 0;
  const rightAvailable = window.innerWidth - (iconRight || 0);

  return {
    shouldOpenUpward: topAvailable > bottomAvailable,
    shouldOpenLeft: leftAvailable > rightAvailable,
    positions: { top: iconBottom, bottom: iconTop, left: iconRight, right: iconLeft },
  };
}
