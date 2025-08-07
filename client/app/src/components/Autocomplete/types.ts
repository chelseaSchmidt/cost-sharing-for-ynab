import { CSSProperties } from 'react';

export const PSEUDO_CSS_KEYS = ['&:hover', '&:disabled', '&:focus-visible'] as const;

export type PseudoCSSProperties = {
  [key in (typeof PSEUDO_CSS_KEYS)[number]]?: CSSProperties;
};
