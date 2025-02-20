import { type GetInterestRatesReturnType } from '@/app/server-handlers/interest-rates'

export const mapArkLatestInterestRates = (interestRates: GetInterestRatesReturnType) =>
  Object.fromEntries(
    Object.keys(interestRates).map((key) => [
      key,
      interestRates[key].latestInterestRate[0]?.rate[0]?.rate,
    ]),
  )
