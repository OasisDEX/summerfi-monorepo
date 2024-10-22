import type BigNumber from 'bignumber.js'

// used rgba instead of var(--xxx) because these colors may be also used in icons
export const valueColorResolver = (value: BigNumber) =>
  value.isZero()
    ? 'rgba(186, 184, 185, 1)'
    : value.gt(0)
      ? 'rgba(105, 223, 49, 1)'
      : 'rgba(255, 87, 57, 1)'
