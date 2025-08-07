import { getTokenGuarded } from '@/tokens/helpers'

import { getDisplayToken } from './get-display-token'

const arkNameMap: { [key: string]: string } = {
  BufferArk: 'Buffer',
  AaveV3: 'Aave V3',
  CompoundV3: 'Compound V3',
  PendlePt: 'Pendle',
  MorphoVault: 'Morpho',
  ERC4626: '',
}

const noTouchZone = ['PRIME', 'EULER', 'SKY']

/**
 * Filters out token symbols from external names that should not be modified.
 * @param part - The name part to check
 * @returns True if the part should be kept (not a token or in no-touch zone), false otherwise
 */
const filterTokensFromExternalName = (part: string) => {
  const potentialToken = part.toUpperCase()

  return !getTokenGuarded(potentialToken) || noTouchZone.includes(potentialToken)
}

/**
 * Generates a human-readable protocol label from an array of name parts.
 *
 * This function processes protocol name components to create a clean, user-friendly label.
 * It handles various cases including:
 * - Mapping protocol names using predefined mappings (e.g., 'BufferArk' → 'Buffer')
 * - Filtering out token symbols when appropriate
 * - Handling special naming patterns like "Gauntlet_USDC_Core" → "Gauntlet Core"
 * - Removing numeric parts at the beginning or end
 * - Deduplicating final components
 *
 * @param nameParts - Array of string parts that make up the protocol name
 * @param noToken - Optional flag to exclude token symbols from the final label. Defaults to false
 * @returns A formatted string representing the protocol label
 *
 * @example
 * ```typescript
 * getProtocolLabel(['BufferArk', 'USDC']) // Returns: "Buffer USDC"
 * getProtocolLabel(['AaveV3', 'DAI'], true) // Returns: "Aave V3"
 * getProtocolLabel(['Gauntlet_USDC_Core']) // Returns: "Gauntlet Core"
 * ```
 */
export const getProtocolLabel = (nameParts: string[], noToken = false): string => {
  const finalNameArray: string[] = []
  const clonedName = [...nameParts]

  const clonedNameLength = clonedName.length

  for (let i = 0; i < clonedNameLength; i++) {
    const isFirst = i === 0
    const isLast = i === clonedNameLength - 1
    const namePart = clonedName[i]
    const mappedPart = arkNameMap[namePart]
    const mainToken = getTokenGuarded(getDisplayToken(namePart).toUpperCase())

    if ((isFirst || isLast) && !Number.isNaN(Number(namePart))) {
      break
    }

    // mapping with `arkNameMap`
    if (mappedPart || mappedPart === '') {
      finalNameArray.push(mappedPart)
    } else if (isFirst && mappedPart !== '') {
      // special case if the first part is also a token (Spark)
      finalNameArray.push(namePart)
    }
    if (mainToken && !noToken && !isFirst) {
      // special case if the first part is also a token (Spark) + token from `getTokenGuarded`
      finalNameArray.push(mainToken.symbol)
    }
    if (!mappedPart && !mainToken && !isFirst) {
      // if the namePart is not in the `arkNameMap` and not a token
      // we add it to the final name array, but it can be something like "Gauntlet_USDC_Core"
      // and this needs additional parsing
      const namePartArray = namePart.split('_')

      if (namePartArray.length > 1) {
        // if the namePart is something like "Gauntlet_USDC_Core", we want "Gauntlet Core"
        finalNameArray.push(namePartArray.filter(filterTokensFromExternalName).join(' '))
      } else {
        finalNameArray.push(namePart)
      }
    }
  }

  const deduplicatedFinalNameArray = Array.from(new Set(finalNameArray))

  return `${deduplicatedFinalNameArray.join(' ')}`
}
