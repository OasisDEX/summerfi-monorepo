import { type ArkType } from '@/arks-interest-rates/types'

/**
 * Filters Ark vaults to only include those with non-zero capacity or balance.
 *
 * This function checks if an Ark has either a positive deposit cap or a positive
 * input token balance, ensuring only active/available Arks are included in
 * interest rate calculations.
 *
 * @param {ArkType} ark - The Ark vault object to evaluate
 * @returns {boolean} True if the Ark has capacity > 0 or balance > 0, false otherwise
 *
 * @example
 * ```typescript
 * const activeArks = arksList.filter(filterArksWithCapHigherThanZero);
 * ```
 */
export const filterArksWithCapHigherThanZero = (ark: ArkType): boolean =>
  Number(ark.depositCap) > 0 || Number(ark.inputTokenBalance) > 0
