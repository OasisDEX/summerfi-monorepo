import { ONE_DOLLAR, Price, TEN_CENTS } from '@summerfi/triggers-shared'

export function isStablecoin(tokenPrice: Price) {
  const difference = tokenPrice - ONE_DOLLAR
  const abs = difference < 0 ? -difference : difference

  return abs < TEN_CENTS
}
