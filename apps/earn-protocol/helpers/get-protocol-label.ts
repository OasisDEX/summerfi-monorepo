import { getDisplayToken, getTokenGuarded } from '@summerfi/app-earn-ui'

const arkNameMap: { [key: string]: string } = {
  BufferArk: 'Buffer',
  AaveV3: 'Aave V3',
  CompoundV3: 'Compound V3',
  PendlePt: 'Pendle',
  MorphoVault: 'Morpho',
  ERC4626: '',
}

const noTouchZone = ['PRIME', 'EULER']

const filterTokensFromExternalName = (part: string) => {
  const potentialToken = part.toUpperCase()

  return !getTokenGuarded(potentialToken) || noTouchZone.includes(potentialToken)
}

export const getProtocolLabel = (nameParts: string[], noToken = false) => {
  const finalNameArray = []
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
