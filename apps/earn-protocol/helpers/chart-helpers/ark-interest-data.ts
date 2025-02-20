import { type GetInterestRatesReturnType } from '@/app/server-handlers/interest-rates'

export const parseArkInterestRates = (arkInterestRatesMap: GetInterestRatesReturnType) => {
  return Object.fromEntries(
    Object.keys(arkInterestRatesMap).map((key) => [
      key,
      arkInterestRatesMap[key].latestInterestRate[0]?.rate[0]?.rate,
    ]),
  )
}
