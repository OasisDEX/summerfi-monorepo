import { type InterestRates } from '@summerfi/app-types'

/**
 * Maps Ark interest rates data to a simplified key-value object format.
 * Extracts the latest interest rate for each asset from the nested structure
 * and returns a flat object with asset keys and their corresponding rates.
 *
 * @param interestRates - Object containing interest rates data with nested structure
 * @returns Object mapping asset keys to their latest interest rates as numbers
 */
export const mapArkLatestInterestRates = (
  interestRates: InterestRates,
): { [key: string]: number } =>
  Object.fromEntries(
    Object.keys(interestRates).map((key) => [
      key,
      interestRates[key].latestInterestRate[0]?.rate[0]?.rate,
    ]),
  )
