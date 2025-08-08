import { type GetInterestRatesQuery } from '@summerfi/summer-earn-rates-subgraph'

/**
 * Prepares the final interest rates response by mapping Ark names to their data.
 *
 * This function creates the final response object that maps Ark display names
 * to their corresponding interest rates data. It maintains the order of
 * the input arrays to ensure proper mapping between names and data.
 *
 * @param {Object} params - The parameters for preparing the response
 * @param {string[]} params.arkNamesList - Array of Ark display names in order
 * @param {GetInterestRatesQuery[]} params.interestRatesMap - Array of interest rates data in corresponding order
 * @returns {Object} Object mapping Ark names to their interest rates data
 *
 * @example
 * ```typescript
 * const response = prepareInterestRatesDataResponse({
 *   arkNamesList: ['Ark1', 'Ark2'],
 *   interestRatesMap: [rates1, rates2]
 * });
 * // Returns: { 'Ark1': rates1, 'Ark2': rates2 }
 * ```
 */
export const prepareInterestRatesDataResponse = ({
  arkNamesList,
  interestRatesMap,
}: {
  arkNamesList: string[]
  interestRatesMap: GetInterestRatesQuery[]
}): { [key: string]: GetInterestRatesQuery } => {
  const result: { [key: string]: GetInterestRatesQuery } = {}

  for (let i = 0; i < arkNamesList.length; i++) {
    const arkName = arkNamesList[i]

    result[arkName] = interestRatesMap[i]
  }

  return result
}
