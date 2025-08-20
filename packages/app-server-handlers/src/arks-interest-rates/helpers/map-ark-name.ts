import { getArkProductId } from '@summerfi/app-utils'

import { type ArkType } from '@/arks-interest-rates/types'

/**
 * Maps an Ark vault to its display name for interest rates data.
 *
 * This function extracts the name from an Ark vault object, falling back
 * to the product ID if no name is available. If neither is available,
 * returns 'NOT FOUND' as a fallback identifier.
 *
 * @param {ArkType} ark - The Ark vault object to extract the name from
 * @returns {string} The Ark's name, product ID, or 'NOT FOUND' fallback
 *
 * @example
 * ```typescript
 * const arkNames = arksList.map(mapArkName);
 * // Returns: ['Ark Name 1', 'product-id-2', 'NOT FOUND']
 * ```
 */
export const mapArkName = (ark: ArkType): string =>
  ark.name ? ark.name : getArkProductId(ark) || 'NOT FOUND'
