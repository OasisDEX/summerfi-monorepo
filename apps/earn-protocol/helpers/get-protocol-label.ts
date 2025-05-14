import { getTokenGuarded } from '@summerfi/app-earn-ui'

const arkNameMap: { [key: string]: string } = {
  BufferArk: 'Buffer',
  AaveV3: 'Aave V3',
  CompoundV3: 'Compound V3',
  PendlePt: 'Pendle',
}

export const getProtocolLabel = (nameParts: string[], noToken = false) => {
  const cleanedName = nameParts.length > 1 ? nameParts.slice(0, -1).join('-') : nameParts[0]
  const cleanedNameWithTokenFilter = noToken
    ? cleanedName
        .split(/[-_]/gu)
        .filter((part) => !getTokenGuarded(part.toUpperCase()))
        .join('-')
    : cleanedName

  const cleanedNameWithParsedUnderscore = cleanedNameWithTokenFilter.replaceAll(/[-_]/gu, '-')
  const [baseName, ...remainingParts] = cleanedNameWithParsedUnderscore.split('-')

  if (baseName === 'MetaMorpho' || baseName === 'MorphoVault') {
    const nameWithoutPrefix = remainingParts.join(' ').replace(/_/gu, ' ')

    return `Morpho ${nameWithoutPrefix
      .split(' ')
      .slice(noToken ? 0 : 1)
      .join(' ')}`
  } else if (baseName === 'ERC4626') {
    const [secondPart] = remainingParts

    return (
      secondPart.charAt(0).toUpperCase() + secondPart.slice(noToken ? 0 : 1).replaceAll('_', ' ')
    )
  } else if (baseName === 'Silo') {
    const [secondPart] = remainingParts

    return `${baseName} ${secondPart.charAt(0).toUpperCase() + secondPart.slice(noToken ? 0 : 1).replaceAll('_', ' ')}`
  }

  return arkNameMap[baseName] ?? baseName
}
