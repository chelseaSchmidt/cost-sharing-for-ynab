export type Bounds = {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};

export interface TooltipState {
  isOpen: boolean;
  shouldOpenUpward: boolean;
  shouldOpenLeft: boolean;
  positions?: Bounds;
}
