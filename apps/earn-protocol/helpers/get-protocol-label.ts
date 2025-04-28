const arkNameMap: { [key: string]: string } = {
  BufferArk: 'Buffer',
  AaveV3: 'Aave V3',
  CompoundV3: 'Compound V3',
  PendlePt: 'Pendle',
}

export const getProtocolLabel = (nameParts: string[]) => {
  const cleanedName = nameParts.length > 1 ? nameParts.slice(0, -1).join('-') : nameParts[0]
  const [baseName, ...remainingParts] = cleanedName.split('-')

  if (baseName === 'MetaMorpho' || baseName === 'MorphoVault') {
    const nameWithoutPrefix = remainingParts.join(' ').replace(/_/gu, ' ')

    return `Morpho ${nameWithoutPrefix.split(' ').slice(1).join(' ')}`
  } else if (baseName === 'ERC4626') {
    const [secondPart] = remainingParts

    return secondPart.charAt(0).toUpperCase() + secondPart.slice(1).replaceAll('_', ' ')
  } else if (baseName === 'Silo') {
    const [secondPart] = remainingParts

    return `${baseName} ${secondPart.charAt(0).toUpperCase() + secondPart.slice(1).replaceAll('_', ' ')}`
  }

  return arkNameMap[baseName] ?? baseName
}
