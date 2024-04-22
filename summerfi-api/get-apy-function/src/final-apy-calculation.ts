import { CalculatedRates } from './protocols/types'
import { LTV } from '@summerfi/serverless-shared'

const LtvToNumber = (ltv: LTV) => Number(ltv) / 10_000

const ltvToMultiply = (ltv: LTV) => 1 + 1 / (1 / LtvToNumber(ltv) - 1)

export const getFinalApy = (params: {
  supplied: CalculatedRates[]
  borrowed: CalculatedRates[]
  ltv: LTV
}): { rates: CalculatedRates; multiply: number } => {
  const { supplied, borrowed, ltv } = params
  const multiply = ltvToMultiply(ltv)
  return {
    rates: {
      apy1d:
        supplied.map(({ apy1d }) => apy1d).reduce((acc, apy) => acc + apy, 0) * multiply -
        borrowed.map(({ apy1d }) => apy1d).reduce((acc, apy) => acc + apy, 0) * (multiply - 1),
      apy7d:
        supplied.map(({ apy7d }) => apy7d).reduce((acc, apy) => acc + apy, 0) * multiply -
        borrowed.map(({ apy7d }) => apy7d).reduce((acc, apy) => acc + apy, 0) * (multiply - 1),
      apy30d:
        supplied.map(({ apy30d }) => apy30d).reduce((acc, apy) => acc + apy, 0) * multiply -
        borrowed.map(({ apy30d }) => apy30d).reduce((acc, apy) => acc + apy, 0) * (multiply - 1),
      apy90d:
        supplied.map(({ apy90d }) => apy90d).reduce((acc, apy) => acc + apy, 0) * multiply -
        borrowed.map(({ apy90d }) => apy90d).reduce((acc, apy) => acc + apy, 0) * (multiply - 1),
      apy365d:
        supplied.map(({ apy365d }) => apy365d).reduce((acc, apy) => acc + apy, 0) * multiply -
        borrowed.map(({ apy365d }) => apy365d).reduce((acc, apy) => acc + apy, 0) * (multiply - 1),
    },
    multiply,
  }
}
