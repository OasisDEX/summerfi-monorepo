import type BigNumber from 'bignumber.js'

export const getAvailabilityLabel: (
  availability: number,
  amount: BigNumber,
) => 'low' | 'medium' | 'high' = (availability, amount) => {
  if (availability === 0) {
    return 'low'
  }
  if (availability > 0 && amount.gt(availability)) {
    return 'medium'
  }

  return 'high'
}
