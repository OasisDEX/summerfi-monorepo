export const roundRateToFourDecimals = (value: number): number =>
  Number.isFinite(value) ? Math.round(value * 10000) / 10000 : value
